export interface MenuItem {
  id: number
  name: string
  base_price: string
  created_at: string
}

const BASE = '/api/menu'

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch menu items')
  return res.json()
}

export async function createMenuItem(name: string, base_price: number): Promise<MenuItem> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, base_price }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create')
  }
  return res.json()
}

export async function updateMenuItem(id: number, name: string, base_price: number): Promise<MenuItem> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, base_price }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to update')
  }
  return res.json()
}

export async function deleteMenuItem(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
}
