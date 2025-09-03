'use client';

interface Product {
  id: string;
  name: string;
  brand: string;
  variety: string;
  package: string;
  size: string;
  price: number;
  supermarket: string;
}

interface ComparisonProduct extends Product {
  quantity: number;
}

interface IntegratedProductTableProps {
  availableProducts: Product[];
  comparisonProducts: ComparisonProduct[];
  onProductToggle: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  onRemoveAll: () => void;
}

export default function IntegratedProductTable({
  availableProducts,
  comparisonProducts,
  onProductToggle,
  onQuantityChange,
  onRemoveProduct,
  onRemoveAll
}: IntegratedProductTableProps) {
  // Combinar productos disponibles con información de comparación
  const displayProducts = availableProducts.map(product => ({
    ...product,
    isInComparison: comparisonProducts.some(cp => cp.id === product.id),
    comparisonQuantity: comparisonProducts.find(cp => cp.id === product.id)?.quantity || 0
  }));

  if (availableProducts.length === 0 && comparisonProducts.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Disponibles</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Selecciona una categoría, subcategoría y tipo de producto para ver los productos disponibles.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Productos Disponibles ({availableProducts.length})
        </h2>
        <div className="flex space-x-2">
          {comparisonProducts.length > 0 && (
            <button
              onClick={onRemoveAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variedad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Envase
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayProducts.map((product) => {
              const isInComparison = product.isInComparison;
              const quantity = product.comparisonQuantity || 0;

              return (
                <tr
                  key={product.id}
                  className={`transition-all duration-200 hover:bg-gray-50 ${
                    isInComparison ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.variety}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.package}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.size}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onProductToggle(product.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        isInComparison
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {isInComparison ? '✓ Agregado' : '+ Agregar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
