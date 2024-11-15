import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
            "Authorization": `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setError("No se pudieron cargar los pedidos.");
        }
      } catch (err) {
        console.error("Error al obtener los pedidos:", err);
        setError("Hubo un error al cargar los pedidos.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page container mx-auto p-6 lg:max-w-4xl text-center">
      <h1 className="text-3xl font-extrabold mb-8">Mis Pedidos</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="order-list space-y-6">
        {orders.map(order => (
          <li key={order.id} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold">Pedido #{order.id}</h2>
            <p>Estado: {order.status}</p>
            <p>Total: ${order.total}</p>
            {order.items && Array.isArray(order.items) ? (
              <ul>
                {order.items.map((item, index) => (
                  <li key={item.product_id || index}>
                    Producto ID: {item.product_id}, Cantidad: {item.cantidad}, Precio: {item.precio}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay productos en este pedido.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisPedidos;
