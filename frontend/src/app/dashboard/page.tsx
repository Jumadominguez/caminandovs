export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Mi Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Comparaciones Recientes
          </h3>
          <p className="text-gray-600">
            Historial de tus comparaciones de precios.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ahorro Total
          </h3>
          <p className="text-gray-600">
            Seguimiento de tu ahorro acumulado.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Supermercados Favoritos
          </h3>
          <p className="text-gray-600">
            Tus supermercados más utilizados.
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-8">
        Dashboard básico - Fase 1 MVP
      </p>
    </div>
  );
}
