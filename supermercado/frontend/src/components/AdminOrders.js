import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "./SidebarAdmin";  // Importamos SidebarAdmin

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/orders/admin-list-orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Error al obtener las órdenes.");
      }
    };

    fetchOrders();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convertir la cadena a un objeto Date
    return new Intl.DateTimeFormat("es-CL", {
      weekday: "short", // Día de la semana abreviado
      year: "numeric", // Año completo
      month: "short", // Mes abreviado
      day: "numeric", // Día del mes
      hour: "2-digit", // Hora en 24 horas
      minute: "2-digit", // Minutos
      second: "2-digit", // Segundos
    }).format(date);
  };

  return (
    <div className="admin-orders-container container mx-auto p-6">
      {/* Sidebar */}
      <SidebarAdmin />
      <h1 className="text-3xl font-bold mb-6">Gestión de Órdenes</h1>
      {error && <p className="text-red-500">{error}</p>}
      {orders.length === 0 && !error ? (
        <p className="text-gray-500">No hay órdenes disponibles.</p>
      ) : (
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Usuario ID</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.user_id}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">${parseFloat(order.total).toFixed(0)}</td>
                <td className="px-4 py-2">{formatDate(order.created_at)}</td> {/* Formateamos la fecha aquí */}
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
