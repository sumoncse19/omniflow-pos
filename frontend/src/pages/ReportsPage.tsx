import { useState, useEffect } from "react";
import { fetchRevenueByOutlet, fetchTopItems } from "../api/reports";
import type { OutletRevenue, TopItem } from "../api/reports";

export default function ReportsPage() {
  const [revenue, setRevenue] = useState<OutletRevenue[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load revenue on mount
  useEffect(() => {
    let cancelled = false;
    fetchRevenueByOutlet()
      .then((data) => {
        if (cancelled) return;
        setRevenue(data);
        if (data.length > 0) setSelectedOutletId(data[0].id);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load reports");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // load top items when outlet changes
  useEffect(() => {
    if (!selectedOutletId) return;
    let cancelled = false;
    fetchTopItems(selectedOutletId)
      .then((data) => {
        if (!cancelled) setTopItems(data);
      })
      .catch(() => {
        if (!cancelled) setTopItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedOutletId]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  const totalRevenue = revenue.reduce(
    (sum, o) => sum + parseFloat(o.revenue),
    0,
  );

  const selectedOutlet = revenue.find((o) => o.id === selectedOutletId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Outlet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Revenue by Outlet</h2>
          {revenue.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <>
              <table className="w-full mb-3">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                      Outlet
                    </th>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.map((outlet) => {
                    const rev = parseFloat(outlet.revenue);
                    const pct =
                      totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
                    return (
                      <tr key={outlet.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>{outlet.name}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          ${rev.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-right px-4 text-sm font-semibold text-gray-700">
                Total: ${totalRevenue.toFixed(2)}
              </div>
            </>
          )}
        </div>

        {/* Top 5 Items per Outlet */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Top 5 Selling Items</h2>

          {revenue.length > 0 && (
            <select
              value={selectedOutletId ?? ""}
              onChange={(e) => setSelectedOutletId(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full mb-3"
            >
              {revenue.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
          )}

          {selectedOutlet && (
            <p className="text-sm text-gray-500 mb-2">
              Showing top items for {selectedOutlet.name}
            </p>
          )}

          {topItems.length === 0 ? (
            <p className="text-gray-400 text-sm">No sales for this outlet</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Item
                  </th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                    Qty Sold
                  </th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, i) => (
                  <tr key={item.name} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {item.total_qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
