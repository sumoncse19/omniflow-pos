import { pool } from "../config/db";

export async function getByOutlet(outletId: number) {
  const { rows } = await pool.query(
    `SELECT menu_items.id, menu_items.name, inventory.stock
     FROM inventory
     JOIN menu_items ON menu_items.id = inventory.menu_item_id
     WHERE inventory.outlet_id = $1
     ORDER BY menu_items.name`,
    [outletId],
  );

  return rows;
}

export async function upsertStock(
  outletId: number,
  menuItemId: number,
  stock: number,
) {
  const { rows } = await pool.query(
    `INSERT INTO inventory (outlet_id, menu_item_id, stock)
     VALUES ($1, $2, $3)
     ON CONFLICT (outlet_id, menu_item_id)
     DO UPDATE SET stock = EXCLUDED.stock
     RETURNING *`,
    [outletId, menuItemId, stock],
  );

  return rows[0];
}

export async function removeStock(outletId: number, menuItemId: number) {
  await pool.query(
    "DELETE FROM inventory WHERE outlet_id = $1 AND menu_item_id = $2",
    [outletId, menuItemId],
  );
}
