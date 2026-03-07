import { useState, useEffect, type SubmitEvent } from "react";
import { fetchSales, createSale } from "../api/sales";
import { fetchInventory } from "../api/inventory";
import { fetchOutletMenu } from "../api/outlets";
import type { Sale, SaleItem } from "../api/sales";
import type { InventoryItem } from "../api/inventory";
import type { OutletMenuItem } from "../api/outlets";

interface Props {
  outletId: number;
  onSaleComplete: () => void;
}

interface CartItem extends SaleItem {
  maxStock: number;
}

export default function SalesPanel({ outletId, onSaleComplete }: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [menuItems, setMenuItems] = useState<OutletMenuItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchInventory(outletId),
      fetchOutletMenu(outletId),
      fetchSales(outletId),
    ])
      .then(([invData, menuData, salesData]) => {
        if (cancelled) return;
        setInventory(invData);
        setMenuItems(menuData);
        setSales(salesData);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load sales data");
      });
    return () => {
      cancelled = true;
    };
  }, [outletId, version]);

  // items in stock that aren't already in cart
  const cartIds = new Set(cart.map((c) => c.menu_item_id));
  const available = inventory.filter(
    (item) => item.stock > 0 && !cartIds.has(item.id),
  );

  function handleAddToCart(e: SubmitEvent) {
    e.preventDefault();
    const id = parseInt(selectedItemId);
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    const menuItem = menuItems.find((m) => m.id === id);
    const price = menuItem ? parseFloat(menuItem.price) : 0;

    setCart([
      ...cart,
      {
        menu_item_id: item.id,
        name: item.name,
        qty: 1,
        price,
        maxStock: item.stock,
      },
    ]);
    setSelectedItemId("");
  }

  function updateCartQty(menuItemId: number, qty: number) {
    setCart(
      cart.map((c) => (c.menu_item_id === menuItemId ? { ...c, qty } : c)),
    );
  }

  function updateCartPrice(menuItemId: number, price: number) {
    setCart(
      cart.map((c) => (c.menu_item_id === menuItemId ? { ...c, price } : c)),
    );
  }

  function removeFromCart(menuItemId: number) {
    setCart(cart.filter((c) => c.menu_item_id !== menuItemId));
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.qty * c.price, 0);

  async function handleCompleteSale() {
    if (cart.length === 0) return;

    const invalid = cart.find((c) => c.price <= 0);
    if (invalid) {
      setError(`Set a price for ${invalid.name}`);
      return;
    }

    try {
      setError("");
      const items: SaleItem[] = cart.map(
        ({ menu_item_id, name, qty, price }) => ({
          menu_item_id,
          name,
          qty,
          price,
        }),
      );
      await createSale(outletId, items);
      setCart([]);
      setVersion((v) => v + 1);
      onSaleComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete sale");
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Sales</h3>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Cart */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-2">New Sale</h4>

        {available.length > 0 && (
          <form onSubmit={handleAddToCart} className="flex gap-3 mb-3">
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              required
            >
              <option value="">Add item to cart...</option>
              {available.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (stock: {item.stock})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        )}

        {cart.length > 0 && (
          <>
            <table className="w-full mb-3">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="text-left py-1">Item</th>
                  <th className="text-left py-1 w-24">Qty</th>
                  <th className="text-left py-1 w-28">Price</th>
                  <th className="text-right py-1 w-24">Subtotal</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.menu_item_id} className="border-t">
                    <td className="py-2">{c.name}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={1}
                        max={c.maxStock}
                        value={c.qty}
                        onChange={(e) =>
                          updateCartQty(
                            c.menu_item_id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={c.price || ""}
                        onChange={(e) =>
                          updateCartPrice(
                            c.menu_item_id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="border rounded px-2 py-1 w-24"
                        placeholder="Price"
                      />
                    </td>
                    <td className="py-2 text-right">
                      ${(c.qty * c.price).toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removeFromCart(c.menu_item_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                Total: ${cartTotal.toFixed(2)}
              </span>
              <button
                onClick={handleCompleteSale}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Complete Sale
              </button>
            </div>
          </>
        )}

        {cart.length === 0 && (
          <p className="text-gray-400 text-sm">No items in cart</p>
        )}
      </div>

      {/* Sales History */}
      <h4 className="font-medium mb-2">Recent Sales</h4>
      {sales.length === 0 ? (
        <p className="text-gray-400 text-sm">No sales yet</p>
      ) : (
        <div className="space-y-2">
          {sales.map((sale) => (
            <div key={sale.id} className="border rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-mono text-gray-600">
                  {sale.receipt_number}
                </span>
                <span className="font-semibold">
                  ${parseFloat(sale.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {sale.items
                  .map((item) => `${item.name} x${item.qty}`)
                  .join(", ")}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(sale.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
