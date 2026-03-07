import { useState } from "react";
import MenuPage from "./pages/MenuPage";
import OutletsPage from "./pages/OutletsPage";
import ReportsPage from "./pages/ReportsPage";

type Page = "menu" | "outlets" | "reports";

export default function App() {
  const [page, setPage] = useState<Page>("menu");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-800">OmniFlow POS</h1>
          <button
            onClick={() => setPage("menu")}
            className={`text-sm font-medium ${page === "menu" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Menu
          </button>
          <button
            onClick={() => setPage("outlets")}
            className={`text-sm font-medium ${page === "outlets" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Outlets
          </button>
          <button
            onClick={() => setPage("reports")}
            className={`text-sm font-medium ${page === "reports" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Reports
          </button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {page === "menu" && <MenuPage />}
        {page === "outlets" && <OutletsPage />}
        {page === "reports" && <ReportsPage />}
      </main>
    </div>
  );
}
