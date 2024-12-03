// ProductoCard.js
import React, { useState } from 'react';
import './ProductoCard.css';
import { Link } from 'react-router-dom';
import { formatPrice } from './utils/utils'; // Asegúrate de que esta función formatea correctamente los precios
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa'; // Iconos para mejorar la UI

function ProductoCard({ producto, agregarAlCarrito }) {
  const [cantidad, setCantidad] = useState(1);
  const [enCarrito, setEnCarrito] = useState(false);

  const handleAgregarAlCarrito = (e) => {
    e.stopPropagation(); // Evita la propagación del evento para que no active la redirección
    agregarAlCarrito(producto, cantidad);
    setEnCarrito(true);
  };

  const handleIncrementarCantidad = (e) => {
    e.stopPropagation(); // Evita la redirección
    setCantidad(cantidad + 1);
    agregarAlCarrito(producto, 1);
  };

  const handleDecrementarCantidad = (e) => {
    e.stopPropagation(); // Evita la redirección
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
      agregarAlCarrito(producto, -1);
    } else {
      setEnCarrito(false);
      setCantidad(1);
    }
  };

  return (
    <div
      className="producto-card bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => window.location.href = `/${producto.slug}`} // Redirige cuando se hace clic en la tarjeta
      aria-label={`Ver detalles del producto ${producto.nombre}`}
    >
      <div className="relative">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {/* Puedes añadir un badge de oferta o destacado aquí si lo deseas */}
      </div>
      <div className="p-4 text-center">
        <p className="text-lg font-semibold text-gray-800">{formatPrice(producto.precio)}</p>
        <p className="text-gray-500 text-sm mt-1">{producto.marca}</p>
        <p className="text-gray-700 font-medium mt-2 line-clamp-1">{producto.nombre}</p>
      </div>
      <div className="p-4">
        {enCarrito ? (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleDecrementarCantidad}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              aria-label={`Disminuir cantidad de ${producto.nombre}`}
            >
              <FaMinus />
            </button>
            <span className="text-lg font-semibold">{cantidad}</span>
            <button
              onClick={handleIncrementarCantidad}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
              aria-label={`Aumentar cantidad de ${producto.nombre}`}
            >
              <FaPlus />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAgregarAlCarrito}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            <FaShoppingCart className="mr-2" /> Agregar al Carrito
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductoCard;
