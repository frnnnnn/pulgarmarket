import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

function Carrito({ carrito, eliminarDelCarrito, abierto, setAbierto }) {
  const navigate = useNavigate();

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  };

  const handleRevisarCarrito = () => {
    setAbierto(false); // Cerrar el carrito lateral
    navigate('/revisar-carrito'); // Navegar a la página de detalles del carrito
  };

  return (
    <div className={`carrito-drawer ${abierto ? 'abierto' : ''}`}>
      <div className="carrito-header">
        <h2>Carrito de Compras</h2>
        <button onClick={() => setAbierto(false)} className="cerrar-btn">×</button>
      </div>
      <div className="carrito-contenido">
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map(item => (
            <div key={item.producto.id} className="carrito-item">
              <div>
                <p className="font-semibold">{item.producto.nombre}</p>
                <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                <p className="text-gray-800 font-semibold">${item.producto.precio * item.cantidad}</p>
              </div>
              <button
                onClick={() => eliminarDelCarrito(item.producto.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
      <div className="carrito-total">
        <p className="text-xl font-bold">Total: ${calcularTotal().toFixed(2)}</p>
      </div>
      <div className="carrito-acciones">
        <button
          onClick={handleRevisarCarrito}
          className="w-full bg-blue-500 text-white py-2 rounded-md mb-2 hover:bg-blue-600 transition"
        >
          Revisar Carrito
        </button>
        <button
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Pagar
        </button>
      </div>
    </div>
  );
}

export default Carrito;
