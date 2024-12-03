import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './AdminOrderDetails.css';  // Se importa el archivo CSS para customización

function AdminOrderDetails() {
  const { orderId } = useParams(); // Obtenemos el ID del pedido de la URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // Nuevo estado que se seleccionará
  const [showModal, setShowModal] = useState(false); // Controlar el modal para confirmar código de retiro
  const [pickupCode, setPickupCode] = useState(""); // Estado para el código de retiro

  useEffect(() => {
    // Cargar los detalles del pedido
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/orders/order-detail-admin/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setOrder(response.data);
        setNewStatus(response.data.status); // Establecemos el estado actual en el select
      } catch (err) {
        setError("Error al cargar el detalle del pedido.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Función para actualizar el estado del pedido
  const handleUpdateStatus = async () => {
    if (newStatus === "entregado") {
      setShowModal(true); // Mostrar el modal cuando se intente marcar como entregado
    } else {
      updateStatus(); // Si no es la fase de "entregado", actualizar el estado sin validar el código
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/orders/verificar-codigo/",
        {
          pickup_code: order.pickup_code, // Código de retiro ya presente en el pedido
          phase: newStatus,
        }
      );
      alert(`Pedido actualizado a fase ${newStatus}`);
      setOrder({ ...order, status: newStatus }); // Actualizar el estado del pedido en el frontend
    } catch (err) {
      alert("Error al actualizar el estado del pedido.");
    }
  };

  // Función para verificar el código de retiro
  const handleConfirmPickupCode = async () => {
    if (pickupCode === order.pickup_code) {
      // Si el código es correcto, marcar como entregado
      setShowModal(false);
      setNewStatus("entregado");
      updateStatus();
    } else {
      alert("Código de retiro incorrecto. Intenta de nuevo.");
    }
  };

  return (
    <div className="admin-order-details-container container mx-auto p-8 max-w-7xl">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {order ? (
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Detalles del Pedido #{order.id}
          </h1>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Productos en el Pedido
            </h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.product.id} className="border-b py-4">
                  <img
                      src={item.product.imagen_url}
                      alt={item.product.nombre}
                      className="w-16 h-16 object-cover mr-4"
                    />
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg text-gray-800">{item.product.nombre}</p>
                    <p className="text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                  <p className="text-gray-600">Cantidad: {item.quantity}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Estado Actual: {order.status}</h3>

            {/* Cambiar el estado del pedido */}
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="p-3 border rounded-md w-full lg:w-1/2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="procesando">Procesando</option>
              <option value="recogiendo">Recogiendo</option>
              <option value="listo">Listo</option>
              <option value="entregado">Entregado</option>
            </select>

            <button
              onClick={handleUpdateStatus}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Actualizar Estado
            </button>
          </div>

          {/* Modal para confirmar el código de retiro */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Confirmar Código de Retiro
                </h2>
                <p className="text-gray-700 mb-4">
                  Para marcar este pedido como entregado, ingrese el código de
                  retiro:
                </p>
                <input
                  type="text"
                  value={pickupCode}
                  onChange={(e) => setPickupCode(e.target.value)}
                  className="w-full border p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Código de retiro"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmPickupCode}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-700">Cargando detalles del pedido...</p>
      )}
    </div>
  );
}

export default AdminOrderDetails;
