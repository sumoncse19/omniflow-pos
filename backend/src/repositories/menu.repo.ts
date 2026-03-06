import { pool } from '../config/db'

export async function findAll() {
  const { rows } = await pool.query('SELECT * FROM menu_items ORDER BY name')
  return rows
}

export async function findById(id: number) {
  const { rows } = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id])
  return rows[0] || null
}

export async function create(name: string, price: number) {
  const { rows } = await pool.query(
    'INSERT INTO menu_items (name, base_price) VALUES ($1, $2) RETURNING *',
    [name, price]
  )
  return rows[0]
}

export async function update(id: number, name: string, price: number) {
  const { rows } = await pool.query(
    'UPDATE menu_items SET name = $1, base_price = $2 WHERE id = $3 RETURNING *',
    [name, price, id]
  )
  return rows[0] || null
}

export async function remove(id: number) {
  const { rowCount } = await pool.query('DELETE FROM menu_items WHERE id = $1', [id])
  return (rowCount ?? 0) > 0
}
