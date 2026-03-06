import { pool } from "../config/db";

export async function findAll() {
  const { rows } = await pool.query("SELECT * FROM outlets ORDER BY name");
  return rows;
}

export async function findById(id: number) {
  const { rows } = await pool.query("SELECT * FROM outlets WHERE id = $1", [
    id,
  ]);
  return rows[0] || null;
}

export async function create(
  companyId: number,
  name: string,
  location?: string,
) {
  const { rows } = await pool.query(
    "INSERT INTO outlets (company_id, name, location) VALUES ($1, $2, $3) RETURNING *",
    [companyId, name, location || null],
  );
  return rows[0];
}

// menu assignment

export async function getOutletMenu(outletId: number) {
  const { rows } = await pool.query(
    `SELECT menu_items.id, menu_items.name, COALESCE(outlet_menu_items.override_price, menu_items.base_price) AS price
     FROM outlet_menu_items
     JOIN menu_items ON menu_items.id = outlet_menu_items.menu_item_id
     WHERE outlet_menu_items.outlet_id = $1
     ORDER BY menu_items.name`,
    [outletId],
  );
  return rows;
}

export async function assignMenuItem(
  outletId: number,
  menuItemId: number,
  overridePrice?: number | null,
) {
  const { rows } = await pool.query(
    `INSERT INTO outlet_menu_items (outlet_id, menu_item_id, override_price)
     VALUES ($1, $2, $3) RETURNING *`,
    [outletId, menuItemId, overridePrice ?? null],
  );
  return rows[0];
}

export async function removeMenuItem(outletId: number, menuItemId: number) {
  const { rowCount } = await pool.query(
    "DELETE FROM outlet_menu_items WHERE outlet_id = $1 AND menu_item_id = $2",
    [outletId, menuItemId],
  );
  return (rowCount ?? 0) > 0;
}
