import { useState, type SubmitEvent } from "react";
import type { MenuItem } from "../api/menu";

interface Props {
  item: MenuItem | null;
  onSave: (name: string, price: number) => void;
  onCancel: () => void;
}

export default function MenuForm({ item, onSave, onCancel }: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [price, setPrice] = useState(item?.base_price ?? "");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const parsed = parseFloat(price);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;
    onSave(name.trim(), parsed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6"
    >
      <h2 className="text-lg font-semibold mb-3">
        {item ? "Edit Menu Item" : "Add Menu Item"}
      </h2>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="number"
          placeholder="Price"
          step="0.01"
          min="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded px-3 py-2 w-28"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {item ? "Update" : "Add"}
        </button>
        {item && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
