import { useState } from "react";
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../api/menu";
import type { MenuItem } from "../api/menu";
import MenuForm from "../components/MenuForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAsync } from "../hooks/useAsync";

export default function MenuPage() {
  const { data, error, setError, loading, refetch } = useAsync(
    () => fetchMenuItems(),
    [],
  );
  const items = data ?? [];
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function handleSave(name: string, price: number) {
    try {
      setError("");
      if (editing) {
        await updateMenuItem(editing.id, name, price);
      } else {
        await createMenuItem(name, price);
      }
      setEditing(null);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      await deleteMenuItem(id);
      setDeleteId(null);
      refetch();
    } catch {
      setDeleteId(null);
      setError("Failed to delete item");
    }
  }

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <MenuForm
        key={editing?.id ?? "new"}
        item={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                Base Price
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">
                  ${parseFloat(item.base_price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(item)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No menu items yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this menu item?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
