import { pool } from '../config/db'

export async function findAll() {
  const { rows } = await pool.query('SELECT * FROM outlets ORDER BY name')
  return rows
}

export async function findById(id: number) {
  const { rows } = await pool.query('SELECT * FROM outlets WHERE id = $1', [id])
  return rows[0] || null
}

export async function create(companyId: number, name: string, location?: string) {
  const { rows } = await pool.query(
    'INSERT INTO outlets (company_id, name, location) VALUES ($1, $2, $3) RETURNING *',
    [companyId, name, location || null]
  )
  return rows[0]
}

// menu assignment

export async function getOutletMenu(outletId: number) {
  const { rows } = await pool.query(
    `SELECT mi.id, mi.name, COALESCE(omi.override_price, mi.base_price) AS price
     FROM outlet_menu_items omi
     JOIN menu_items mi ON mi.id = omi.menu_item_id
     WHERE omi.outlet_id = $1
     ORDER BY mi.name`,
    [outletId]
  )
  return rows
}

export async function assignMenuItem(outletId: number, menuItemId: number, overridePrice?: number | null) {
  const { rows } = await pool.query(
    `INSERT INTO outlet_menu_items (outlet_id, menu_item_id, override_price)
     VALUES ($1, $2, $3) RETURNING *`,
    [outletId, menuItemId, overridePrice ?? null]
  )
  return rows[0]
}

export async function removeMenuItem(outletId: number, menuItemId: number) {
  const { rowCount } = await pool.query(
    'DELETE FROM outlet_menu_items WHERE outlet_id = $1 AND menu_item_id = $2',
    [outletId, menuItemId]
  )
  return (rowCount ?? 0) > 0
}
