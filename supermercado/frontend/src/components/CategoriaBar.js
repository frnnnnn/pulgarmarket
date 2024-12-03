import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';

function CategoriaBar({ categoriaSeleccionada, setCategoriaSeleccionada }) {
  const [categorias, setCategorias] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [error, setError] = useState(null);
  const [categoriasVisibles, setCategoriasVisibles] = useState(6); // Número inicial de categorías visibles

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        // Primero obtenemos las categorías
        const responseCategorias = await axios.get('http://127.0.0.1:8000/products/categorias');
        setCategorias(responseCategorias.data);

        // Luego obtenemos los productos
        const responseProductos = await axios.get('http://127.0.0.1:8000/products');
        const productos = responseProductos.data;

        // Contar los productos por categoría
        const conteoProductos = responseCategorias.data.reduce((acc, categoria) => {
          // Filtramos los productos por cada categoría
          const cantidadProductos = productos.filter(producto => producto.categoria === categoria.id).length;
          acc[categoria.id] = cantidadProductos; // Asignamos la cantidad a la categoría correspondiente
          return acc;
        }, {});

        setProductosPorCategoria(conteoProductos);

      } catch (err) {
        console.error("Error al obtener las categorías o productos:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    fetchCategorias();
  }, []); // No dependemos de categorias aquí, ya que las obtenemos una sola vez

  // Ordenar las categorías por el número de productos
  const categoriasOrdenadas = categorias.sort((a, b) => {
    const productosA = productosPorCategoria[a.id] || 0;
    const productosB = productosPorCategoria[b.id] || 0;
    return productosB - productosA; // Orden descendente por el número de productos
  });

  // Mostrar solo las categorías visibles
  const categoriasAMostrar = categoriasOrdenadas.slice(0, categoriasVisibles);

  // Función para cargar más categorías
  const cargarMasCategorias = () => {
    setCategoriasVisibles(categoriasVisibles + 6);
  };

  return (
    <div className="categoria-bar bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Categorías</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        <li
          className={`cursor-pointer px-2 py-1 rounded-md flex items-center justify-between ${
            categoriaSeleccionada === null ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => setCategoriaSeleccionada(null)}
        >
          <span>Todas las Categorías</span>
          {categoriaSeleccionada === null && <FaCheck />}
        </li>
        {categoriasAMostrar.map(categoria => (
          <li
            key={categoria.id}
            className={`cursor-pointer px-2 py-1 rounded-md flex items-center justify-between ${
              categoriaSeleccionada === categoria.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => setCategoriaSeleccionada(categoria.id)}
          >
            <span>{categoria.nombre}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({productosPorCategoria[categoria.id] || 0})
            </span>
            {categoriaSeleccionada === categoria.id && <FaCheck />}
          </li>
        ))}
      </ul>

      {/* Botón para cargar más categorías */}
      {categoriasVisibles < categoriasOrdenadas.length && (
        <button
          onClick={cargarMasCategorias}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Ver más categorías
        </button>
      )}
    </div>
  );
}

export default CategoriaBar;
