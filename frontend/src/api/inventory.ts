export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
}

export async function fetchInventory(
  outletId: number,
): Promise<InventoryItem[]> {
  const res = await fetch(`/api/outlets/${outletId}/inventory`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function updateStock(
  outletId: number,
  menuItemId: number,
  stock: number,
): Promise<void> {
  const res = await fetch(`/api/outlets/${outletId}/inventory`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu_item_id: menuItemId, stock }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update stock");
  }
}
