import { useState, type SubmitEvent } from "react";
import { fetchInventory, updateStock } from "../api/inventory";
import { fetchOutletMenu } from "../api/outlets";
import { useAsync } from "../hooks/useAsync";

interface Props {
  outletId: number;
  onStockChange?: () => void;
}

export default function InventoryPanel({ outletId, onStockChange }: Props) {
  const { data, error, setError, refetch } = useAsync(
    () => Promise.all([fetchInventory(outletId), fetchOutletMenu(outletId)]),
    [outletId],
  );
  const items = data?.[0] ?? [];
  const menuItems = data?.[1] ?? [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState("");
  const [addItemId, setAddItemId] = useState("");
  const [addStock, setAddStock] = useState("");

  const inventoryIds = new Set(items.map((i) => i.id));
  const missing = menuItems.filter((m) => !inventoryIds.has(m.id));

  async function handleUpdate(menuItemId: number) {
    const parsed = parseInt(stockValue);
    if (isNaN(parsed) || parsed < 0) return;
    try {
      setError("");
      await updateStock(outletId, menuItemId, parsed);
      setEditingId(null);
      setStockValue("");
      refetch();
      onStockChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update stock");
    }
  }

  async function handleAdd(e: SubmitEvent) {
    e.preventDefault();
    const itemId = parseInt(addItemId);
    const stock = parseInt(addStock);
    if (!itemId || isNaN(stock) || stock < 0) return;
    try {
      setError("");
      await updateStock(outletId, itemId, stock);
      setAddItemId("");
      setAddStock("");
      refetch();
      onStockChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stock");
    }
  }

  return (
    <div>
      {error ? (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      ) : null}

      {missing.length > 0 ? (
        <form onSubmit={handleAdd} className="flex gap-3 mb-4">
          <select
            value={addItemId}
            onChange={(e) => setAddItemId(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            required
          >
            <option value="">Set stock for...</option>
            {missing.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock"
            min="0"
            value={addStock}
            onChange={(e) => setAddStock(e.target.value)}
            className="border rounded px-3 py-2 w-24"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </form>
      ) : null}

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Item
            </th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
              Stock
            </th>
            <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-t hover:bg-gray-50 ${item.stock === 0 ? "bg-red-50" : ""}`}
            >
              <td className="px-4 py-3">
                {item.name}
                {item.stock === 0 && (
                  <span className="ml-2 text-xs text-red-600 font-medium">
                    Out of stock
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {editingId === item.id ? (
                  <input
                    type="number"
                    min="0"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                    className="border rounded px-2 py-1 w-24"
                    autoFocus
                  />
                ) : (
                  <span
                    className={
                      item.stock === 0 ? "text-red-600 font-medium" : ""
                    }
                  >
                    {item.stock}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {editingId === item.id ? (
                  <span className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setStockValue("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setStockValue(String(item.stock));
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                No inventory items
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
