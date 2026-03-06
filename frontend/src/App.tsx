import MenuPage from './pages/MenuPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">OmniFlow POS</h1>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <MenuPage />
      </main>
    </div>
  )
}
