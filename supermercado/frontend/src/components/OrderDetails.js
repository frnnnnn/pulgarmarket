import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import "./OrderDetail.css";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/orders/order-detail/${orderId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "No se pudieron cargar los detalles del pedido.");
        }
      } catch (err) {
        console.error("Error al obtener los detalles del pedido:", err);
        setError("Hubo un error al cargar los detalles del pedido.");
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  return (
    <div className="order-detail-container container mx-auto p-6 lg:max-w-4xl">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-blue-500 underline hover:text-blue-700"
      >
        Volver a mis pedidos
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {order ? (
        <div className="order-detail bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-extrabold mb-6">Pedido #{order.id}</h1>
          <p className="text-lg font-semibold mb-2">Estado: {order.status}</p>
          <p className="text-lg font-semibold mb-2">Total: ${parseFloat(order.total).toFixed(2)}</p>
          <div className="pickup-code bg-green-100 text-green-800 font-bold text-xl p-4 rounded-lg mb-6">
            Código de Retiro: {order.pickup_code}
          </div>
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <ul className="order-items-list space-y-4">
            {order.items.map((item) => (
              <li key={item.product.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={item.product.imagen_url}
                    alt={item.product.nombre}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-semibold">{item.product.nombre}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-700">Cargando detalles del pedido...</p>
      )}
    </div>
  );
}

export default OrderDetail;
