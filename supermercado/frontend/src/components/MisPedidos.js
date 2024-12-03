import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MisPedidos.css";
import CircularIndeterminate from "./CircularIndeterminate";


function MisPedidos() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/orders/my-orders/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "No se pudieron cargar los pedidos.");
        }
      } catch (err) {
        console.error("Error al obtener los pedidos:", err);
        setError("Hubo un error al cargar los pedidos.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="mis-pedidos-container container mx-auto p-6 lg:max-w-6xl">
      <h1 className="text-4xl font-extrabold text-center mb-8">Mis Pedidos</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {orders.length === 0 && !error ? (
  <div className="empty-orders flex flex-col items-center justify-center h-96"> {/* Centrado flex */}
    <div className="spinner-container mb-4">
      <CircularIndeterminate />
    </div>
    <p className="text-gray-700 text-lg">
      <button
        onClick={() => navigate("/")}
        className="text-blue-500 underline hover:text-blue-700"
      >
        Explora nuestros productos
      </button>
    </p>
  </div>
) : (
  <div className="orders-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {orders.map((order) => (
      <div
        key={order.id}
        className="order-card bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
        onClick={() => navigate(`/orders/${order.id}`)} // Navega a los detalles del pedido
      >
        <h2 className="order-id text-xl font-semibold mb-4">
          Pedido #{order.id}
        </h2>
        <p className="order-status text-sm text-gray-600 mb-2">
          Estado:{" "}
          <span
            className={`status-pill ${
              order.status === "procesando"
                ? "bg-yellow-300 text-yellow-800"
                : order.status === "preparando"
                ? "bg-blue-300 text-blue-800"
                : "bg-green-300 text-green-800"
            } px-2 py-1 rounded-full`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </p>
        <p className="order-total text-lg font-semibold mb-4">
          Total: ${parseFloat(order.total).toFixed(0)}
        </p>
        <h3 className="order-items-header text-lg font-bold mb-3">
          Productos:
        </h3>
        <ul className="order-items-list space-y-2">
          {order.items.map((item) => (
            <li
              key={item.product.id}
              className="flex justify-between items-center text-sm"
            >
              <div className="item-info flex items-center">
                <img
                  src={item.product.imagen_url}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div>
                  <p className="item-name font-medium">
                    {item.product.name}
                  </p>
                  <p className="item-quantity text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="item-price text-gray-800 font-semibold">
                ${parseFloat(item.price).toFixed(0)}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-blue-500 text-sm underline mt-3">
          Ver detalles del pedido
        </p>
      </div>
    ))}
  </div>
)}
    </div>
  );
}


export default MisPedidos;
