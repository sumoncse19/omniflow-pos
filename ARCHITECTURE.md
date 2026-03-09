# Architecture

## Database

[View ERD on dbdiagram.io](https://dbdiagram.io/d/omniflow-pos-69ae702dcf54053b6f389d01)

![Database ERD](ERD.png)

7 tables. `companies` → `outlets` → everything else. `menu_items` is the master catalog, `outlet_menu_items` links items to specific outlets with an optional price override. Stock is tracked per outlet in `inventory`, sales go into `sales` with the line items stored as JSONB (didn't want a separate `sale_items` table for something that's basically write-once). `receipt_sequences` handles daily per-outlet receipt numbering using `ON CONFLICT DO UPDATE` to avoid race conditions.

All child tables cascade on outlet deletion. Stock can't go negative — enforced at the DB level with `CHECK (stock >= 0)` rather than in application code, because I don't trust app-level checks under concurrency.

## Scaling considerations

Target is around 10 outlets, ~100k transactions/month. A single Postgres instance handles this fine.

Things I'd do as it grows:

- **PgBouncer** for connection pooling. Currently using a pg Pool of 20 connections directly which is fine for now but won't scale well with multiple app instances.
- **Partition `sales` by month.** Old data stays queryable but doesn't slow down current-month writes.
- **Read replica for reports.** The report queries (revenue aggregation, top items) are already isolated in their own repo files so pointing them at a replica is mostly a config change.
- **Materialized views** for the dashboard numbers instead of computing them live every time. Refresh every few minutes.
- Eventually a `daily_summaries` table with a cron job, so reports don't touch raw sales at all.

## Splitting into services

The monolith already has natural boundaries — menu, outlets, inventory, sales, reports each have their own route/controller/service/repo stack. Only cross-dependency is `outlet.service` calling `inventoryRepo.removeStock` when you unassign a menu item.

If I had to split:

- **Menu Service** — owns `menu_items` and `outlet_menu_items`. Read-heavy, cacheable, low write volume.
- **Sales + Inventory Service** — I'd keep these together. Right now the sale creation atomically deducts stock in one transaction. Splitting them into separate services means losing that atomicity, and the saga pattern adds a lot of complexity for not much benefit at this scale. Maybe revisit if sales volume gets 10x bigger.
- **Reports Service** — read-only, can run on a replica, tolerates stale data. Easy to split.
- **Outlet Service** — just CRUD for outlet metadata, rarely changes.

Communication between services would be REST for real-time stuff (stock check during sale) and events for async things (sale.created → reports update).

## Offline mode

When a POS terminal loses connectivity to HQ:

1. Sales queue locally (IndexedDB or SQLite depending on the client).
2. Receipt numbers come from a pre-allocated batch (requested while online, like 100 numbers at a time).
3. Stock is tracked against a local copy of inventory — might be slightly stale but better than blocking sales.
4. On reconnect, queued sales sync to HQ in order. If there's a stock conflict (two terminals sold the last unit), HQ accepts both and flags the negative inventory for review. You can't unsell a burger.

## POS ↔ KDS on local network

KDS needs orders even when the outlet is offline. Both POS and KDS are on the same LAN so this doesn't need internet.

A lightweight relay server (Node process on the POS machine or a Raspberry Pi) acts as a WebSocket hub. POS sends orders to the relay, relay fans them out to all KDS screens. Discovery via mDNS (`_omniflow-relay._tcp.local`) so you don't have to hardcode IPs.

If the relay dies, POS falls back to direct WebSocket to KDS. If that fails too, orders print on paper.
