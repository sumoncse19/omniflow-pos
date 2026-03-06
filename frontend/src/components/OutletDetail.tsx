import { useState, useEffect, useCallback } from 'react'
import { fetchOutletMenu, assignMenuItem, removeMenuItem } from '../api/outlets'
import { fetchMenuItems } from '../api/menu'
import type { OutletMenuItem } from '../api/outlets'
import type { MenuItem } from '../api/menu'

interface Props {
  outletId: number
}

export default function OutletDetail({ outletId }: Props) {
  const [menu, setMenu] = useState<OutletMenuItem[]>([])
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [overridePrice, setOverridePrice] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      const [menuData, itemsData] = await Promise.all([
        fetchOutletMenu(outletId),
        fetchMenuItems(),
      ])
      setMenu(menuData)
      setAllItems(itemsData)
    } catch {
      setError('Failed to load outlet menu')
    }
  }, [outletId])

  useEffect(() => { load() }, [load])

  // items not yet assigned to this outlet
  const assignedIds = new Set(menu.map((m) => m.id))
  const available = allItems.filter((item) => !assignedIds.has(item.id))

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    const itemId = parseInt(selectedItemId)
    if (!itemId) return
    try {
      setError('')
      const price = overridePrice ? parseFloat(overridePrice) : undefined
      await assignMenuItem(outletId, itemId, price)
      setSelectedItemId('')
      setOverridePrice('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign')
    }
  }

  async function handleRemove(menuItemId: number) {
    try {
      setError('')
      await removeMenuItem(outletId, menuItemId)
      await load()
    } catch {
      setError('Failed to remove item')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Outlet Menu</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      {available.length > 0 && (
        <form onSubmit={handleAssign} className="flex gap-3 mb-4">
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            required
          >
            <option value="">Select item to assign...</option>
            {available.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (${parseFloat(item.base_price).toFixed(2)})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Override price"
            step="0.01"
            min="0.01"
            value={overridePrice}
            onChange={(e) => setOverridePrice(e.target.value)}
            className="border rounded px-3 py-2 w-36"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Assign
          </button>
        </form>
      )}

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Item</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Price</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{item.name}</td>
              <td className="px-4 py-3">${parseFloat(item.price).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {menu.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                No items assigned
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
