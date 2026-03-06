export interface Outlet {
  id: number
  company_id: number
  name: string
  location: string | null
  created_at: string
}

export interface OutletMenuItem {
  id: number
  name: string
  price: string
}

const BASE = '/api/outlets'

export async function fetchOutlets(): Promise<Outlet[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch outlets')
  return res.json()
}

export async function createOutlet(name: string, location?: string): Promise<Outlet> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, location }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create')
  }
  return res.json()
}

export async function fetchOutletMenu(outletId: number): Promise<OutletMenuItem[]> {
  const res = await fetch(`${BASE}/${outletId}/menu`)
  if (!res.ok) throw new Error('Failed to fetch outlet menu')
  return res.json()
}

export async function assignMenuItem(outletId: number, menuItemId: number, overridePrice?: number): Promise<void> {
  const body: any = { menu_item_id: menuItemId }
  if (overridePrice !== undefined) body.override_price = overridePrice
  const res = await fetch(`${BASE}/${outletId}/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to assign')
  }
}

export async function removeMenuItem(outletId: number, menuItemId: number): Promise<void> {
  const res = await fetch(`${BASE}/${outletId}/menu/${menuItemId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to remove item')
}
