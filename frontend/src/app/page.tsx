export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛒 Caminando Online
            </h1>
            <nav className="space-x-4">
              <a href="/" className="text-blue-600 font-medium">Inicio</a>
              <a href="/productos-comparados" className="text-gray-600 hover:text-gray-900">Comparar</a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compara Precios de Supermercados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra los mejores precios en productos de tus supermercados favoritos.
            Ahorra tiempo y dinero con comparaciones inteligentes.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Busca y Compara Productos
          </h3>

          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué producto buscas?
              </label>
              <input
                type="text"
                id="search"
                placeholder="Ej: leche, pan, arroz..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Supermarket Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supermercados a comparar
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Carrefour', 'Disco', 'Jumbo', 'Dia'].map((supermarket) => (
                  <label key={supermarket} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{supermarket}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                🔍 Buscar y Comparar
              </button>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Comparación Instantánea
            </h4>
            <p className="text-gray-600">
              Resultados en segundos de múltiples supermercados.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ahorra Dinero
            </h4>
            <p className="text-gray-600">
              Encuentra siempre el mejor precio disponible.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Fácil de Usar
            </h4>
            <p className="text-gray-600">
              Interfaz intuitiva en desktop y mobile.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Caminando Online - MVP Fase 1</p>
            <p className="text-sm mt-2">Plataforma de comparación de precios</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
