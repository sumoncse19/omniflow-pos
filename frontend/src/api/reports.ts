export interface OutletRevenue {
  id: number;
  name: string;
  revenue: string;
}

export interface TopItem {
  name: string;
  total_qty: string;
}

export async function fetchRevenueByOutlet(): Promise<OutletRevenue[]> {
  const res = await fetch("/api/reports/revenue");
  if (!res.ok) throw new Error("Failed to fetch revenue");
  return res.json();
}

export async function fetchTopItems(limit = 5): Promise<TopItem[]> {
  const res = await fetch(`/api/reports/top-items?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch top items");
  return res.json();
}
