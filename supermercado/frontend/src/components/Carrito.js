import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaTrash, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Carrito.css'; // Puedes mantener estilos personalizados si es necesario

function Carrito({ carrito, eliminarDelCarrito, abierto, setAbierto }) {
  const navigate = useNavigate();

  // Cálculo del total con useMemo para optimización
  const total = useMemo(() => {
    return carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  }, [carrito]);

  const handleRevisarCarrito = () => {
    setAbierto(false); // Cerrar el carrito lateral
    navigate('/revisar-carrito'); // Navegar a la página de detalles del carrito
  };

  const handleEliminar = (id, nombre) => {
    eliminarDelCarrito(id);
    toast.info(`${nombre} ha sido eliminado del carrito.`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <>
      <div className={`carrito-drawer ${abierto ? 'abierto' : ''}`}>
        <div className="carrito-header flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-semibold">Carrito de Compras</h2>
          <button onClick={() => setAbierto(false)} aria-label="Cerrar Carrito">
            <FaTimes className="text-xl text-gray-600 hover:text-gray-800 transition" />
          </button>
        </div>
        <div className="carrito-contenido p-4 flex flex-col h-full">
          {carrito.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">El carrito está vacío.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto">
              {carrito.map(item => (
                <div key={item.producto.id} className="carrito-item flex items-center justify-between mb-4 p-2 border-b">
                  <div className="flex items-center">
                    <img src={item.producto.imagen} alt={item.producto.nombre} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                      <p className="font-semibold">{item.producto.nombre}</p>
                      <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                      <p className="text-gray-800 font-semibold">${(item.producto.precio)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminar(item.producto.id, item.producto.nombre)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label={`Eliminar ${item.producto.nombre}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Total */}
          {carrito.length > 0 && (
            <div className="carrito-total border-t pt-4">
              <p className="text-xl font-bold">Total: ${total.toFixed(0)}</p>
            </div>
          )}
        </div>
        {/* Acciones */}
        {carrito.length > 0 && (
          <div className="carrito-acciones p-4 flex flex-col space-y-2">
            <button
              onClick={handleRevisarCarrito}
              className="flex items-center justify-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FaShoppingCart className="mr-2" /> Revisar Carrito
            </button>

          </div>
        )}
      </div>
      {/* Fondo Oscuro al Abrir el Carrito */}
      {abierto && <div className="carrito-overlay" onClick={() => setAbierto(false)}></div>}
      {/* Contenedor de Toast */}
      <ToastContainer />
    </>
  );
}

export default Carrito;
