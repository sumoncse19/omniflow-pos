import { useState, type SubmitEvent } from "react";
import { fetchOutlets, createOutlet } from "../api/outlets";
import OutletDetail from "../components/OutletDetail";
import { useAsync } from "../hooks/useAsync";

export default function OutletsPage() {
  const { data, error, setError, loading, refetch } = useAsync(
    () => fetchOutlets(),
    [],
  );
  const outlets = data ?? [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setError("");
      await createOutlet(name.trim(), location.trim() || undefined);
      setName("");
      setLocation("");
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Outlets</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded-lg shadow mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">Add Outlet</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Outlet name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {outlets.map((outlet) => (
          <button
            key={outlet.id}
            onClick={() =>
              setSelectedId(selectedId === outlet.id ? null : outlet.id)
            }
            className={`text-left p-4 rounded-lg shadow transition ${
              selectedId === outlet.id
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <h3 className="font-semibold">{outlet.name}</h3>
            {outlet.location && (
              <p
                className={`text-sm ${selectedId === outlet.id ? "text-blue-100" : "text-gray-500"}`}
              >
                {outlet.location}
              </p>
            )}
          </button>
        ))}
        {outlets.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center py-6">
            No outlets yet
          </p>
        )}
      </div>

      {selectedId && <OutletDetail outletId={selectedId} />}
    </div>
  );
}
