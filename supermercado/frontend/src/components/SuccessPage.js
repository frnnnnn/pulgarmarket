import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SuccessPage.css';
import checkedImage from './images/checked.png';

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmarPedido = async () => {
      try {
        // Extrae parámetros de la URL
        const queryParams = new URLSearchParams(location.search);
        const total = queryParams.get('total');
        const items = queryParams.get('items');

        console.log("Total:", total);
        console.log("Items:", items);

        if (!total || !items) {
          setError("Faltan detalles del pedido en la URL");
          return;
        }

        const parsedItems = JSON.parse(items);

        const response = await fetch("http://127.0.0.1:8000/orders/confirmar-pedido/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            total, 
            products: parsedItems.map(item => ({
              id: item.producto_id,
              quantity: item.cantidad,
              price: item.precio
            }))
          }), 
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          const errorData = await response.json();
          console.error("Error al confirmar el pedido:", errorData);
          setError("No se pudo confirmar el pedido.");
        }
      } catch (err) {
        console.error("Error al confirmar el pedido:", err);
        setError("Hubo un error al confirmar el pedido.");
      }
    };

    confirmarPedido();
  }, [location.search]);

  return (
    <div className="success-page container mx-auto p-6 lg:max-w-4xl text-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <img 
            src={checkedImage}
            alt="Compra exitosa" 
            className="w-16 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">¡Compra exitosa!</h1>
          <p className="text-gray-700 text-lg">Gracias por tu compra. Te hemos enviado un correo con los detalles de tu pedido.</p>
        </div>

        {orderDetails ? (
          <div className="order-summary bg-gray-50 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>
            <ul className="text-left space-y-4">
              {orderDetails.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b py-4">
                  <div>
                    <img 
                      src={item.image_url}
                      alt={item.title} 
                      className="w-12 h-12 object-cover rounded mr-4" 
                    />
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right text-xl font-bold">
              <p>Total: ${orderDetails.total}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 mt-4">{error || "Cargando detalles de la compra..."}</p>
        )}

        <div className="mt-10 flex flex-col lg:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-full lg:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Seguir comprando
          </button>
          <button 
            onClick={() => navigate('/perfil')} 
            className="w-full lg:w-auto bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
