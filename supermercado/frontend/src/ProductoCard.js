import React, { useState } from 'react';
import './ProductoCard.css';
import { Link } from 'react-router-dom';

function ProductoCard({ producto, agregarAlCarrito }) {
  const [cantidad, setCantidad] = useState(1);
  const [enCarrito, setEnCarrito] = useState(false);

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad);
    setEnCarrito(true);
  };

  const handleIncrementarCantidad = () => {
    setCantidad(cantidad + 1);
    agregarAlCarrito(producto, 1);
  };

  const handleDecrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
      agregarAlCarrito(producto, -1);
    } else {
      setEnCarrito(false);
      setCantidad(1);
    }
  };

  return (
    <div className="producto-card bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
      <Link to={`/${producto.slug}`}>
      <div className="relative">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>
      <div className="text-center mt-4">
        <p className="text-xl font-semibold text-gray-800">${producto.precio}</p>
        <p className="text-gray-500 text-xs mt-1">{producto.marca}</p>
        <p className="text-gray-700 font-semibold">{producto.nombre}</p>
      </div>
      <div className="w-full mt-4">
        {enCarrito ? (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleDecrementarCantidad}
              className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
            >
              -
            </button>
            <span className="text-lg font-semibold">{cantidad}</span>
            <button
              onClick={handleIncrementarCantidad}
              className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAgregarAlCarrito}
            className="z-50 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Agregar al Carrito
          </button>
        )}
      </div>
      </Link>
    </div>
  );
}

export default ProductoCard;
