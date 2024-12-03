import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal'; // Suponiendo que tienes un modal de inicio de sesión
import './CarritoDetalle.css';

function CarritoDetalle({ carrito, actualizarCantidad, eliminarDelCarrito }) {
  const navigate = useNavigate();
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  const manejarSeleccion = (id) => {
    setProductosSeleccionados((prevSeleccion) =>
      prevSeleccion.includes(id)
        ? prevSeleccion.filter(productId => productId !== id)
        : [...prevSeleccion, id]
    );
  };

  const manejarSeleccionarTodo = () => {
    if (productosSeleccionados.length === carrito.length) {
      setProductosSeleccionados([]);
    } else {
      setProductosSeleccionados(carrito.map(item => item.producto.id));
    }
  };

  const iniciarPago = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const items = carrito
        .filter(item => productosSeleccionados.includes(item.producto.id))
        .map(item => ({
          id: item.producto.id, // ID del producto
          title: item.producto.nombre, // Nombre del producto
          quantity: Number(item.cantidad), // Convertir a número
          price: Number(item.producto.precio), // Convertir a número
        }));

      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Guarda los datos del pedido temporalmente en localStorage
      localStorage.setItem(
        "pedido",
        JSON.stringify({ total, items })
      );

      // Enviar solicitud al backend
      const response = await fetch("http://127.0.0.1:8000/payments/create_payment/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        window.location.href = data.init_point; // Redirige a MercadoPago
      } else {
        console.error("Respuesta del backend:", data);
        setError("Error al generar el enlace de pago.");
      }
    } catch (err) {
      console.error("Error al iniciar el pago:", err);
      setError("Error al generar el enlace de pago.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="carrito-detalle-container flex flex-col lg:flex-row gap-8 p-4 max-w-screen-lg mx-auto">
      <div className="carrito-detalle-productos bg-white rounded-lg shadow-md p-4 flex-grow">
        <h2 className="text-2xl font-semibold mb-4">Carro ({carrito.length} productos)</h2>
        <button
          onClick={manejarSeleccionarTodo}
          className="seleccionar-todos-btn mb-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          {productosSeleccionados.length === carrito.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
        </button>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          carrito.map(item => (
            <div key={item.producto.id} className="carrito-detalle-item flex items-center py-4 border-b">
              <input
                type="checkbox"
                checked={productosSeleccionados.includes(item.producto.id)}
                onChange={() => manejarSeleccion(item.producto.id)}
                className="mr-4"
              />
              <img src={item.producto.imagen} alt={item.producto.nombre} className="w-16 h-16 object-cover rounded mr-4" />
              <div className="flex-grow">
                <p className="font-semibold">{item.producto.nombre}</p>
                <p className="text-gray-500 text-sm">{item.producto.marca}</p>
                <div className="text-gray-600 text-sm mt-1">Tamaño: {item.producto.tamano || 'N/A'}</div>
                <div className="text-gray-800 font-semibold">${item.producto.precio}</div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-l"
                >
                  -
                </button>
                <span className="px-4">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => eliminarDelCarrito(item.producto.id)}
                  className="ml-4 text-red-500 font-semibold hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="carrito-detalle-resumen bg-gray-50 rounded-lg shadow-md p-4 w-full lg:w-1/3">
        <h3 className="text-xl font-semibold mb-4">Resumen de la compra</h3>
        <p className="text-lg font-semibold mb-2">
          Total Seleccionado: ${carrito
            .filter(item => productosSeleccionados.includes(item.producto.id))
            .reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
            .toFixed(0)}
        </p>
        {error && <p className="text-red-500">{error}</p>}
        {isProcessing ? (
          <p className="text-blue-500 font-semibold mb-4">Procesando el pago...</p>
        ) : (
          <button
            onClick={iniciarPago}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mb-4"
            disabled={productosSeleccionados.length === 0}
          >
            Continuar compra
          </button>
        )}
        {!isAuthenticated && (
          <p className="text-red-500 mt-2">Debes iniciar sesión para realizar la compra.</p>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Seguir comprando
        </button>
      </div>

      {/* Modal de inicio de sesión */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={() => setIsAuthenticated(true)} />
    </div>
  );
}

export default CarritoDetalle;
