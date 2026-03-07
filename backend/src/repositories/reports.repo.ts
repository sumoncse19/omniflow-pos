import { pool } from "../config/db";

export async function getRevenueByOutlet() {
  const { rows } = await pool.query(
    `SELECT outlets.id, outlets.name, COALESCE(SUM(sales.total_amount), 0) AS revenue
     FROM outlets
     LEFT JOIN sales ON sales.outlet_id = outlets.id
     GROUP BY outlets.id, outlets.name
     ORDER BY revenue DESC`,
  );
  return rows;
}

export async function getTopItems(outletId: number, limit: number) {
  const { rows } = await pool.query(
    `SELECT item->>'name' AS name, SUM((item->>'qty')::int) AS total_qty
     FROM sales, jsonb_array_elements(sales.items) AS item
     WHERE sales.outlet_id = $1
     GROUP BY name
     ORDER BY total_qty DESC
     LIMIT $2`,
    [outletId, limit],
  );
  return rows;
}
