export interface SaleItem {
  menu_item_id: number;
  name: string;
  qty: number;
  price: number;
}

export interface Sale {
  id: number;
  outlet_id: number;
  receipt_number: string;
  items: SaleItem[];
  total_amount: string;
  created_at: string;
}

export async function fetchSales(outletId: number): Promise<Sale[]> {
  const res = await fetch(`/api/outlets/${outletId}/sales`);
  if (!res.ok) throw new Error("Failed to fetch sales");
  return res.json();
}

export async function createSale(
  outletId: number,
  items: SaleItem[],
): Promise<Sale> {
  const res = await fetch(`/api/outlets/${outletId}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create sale");
  }
  return res.json();
}
