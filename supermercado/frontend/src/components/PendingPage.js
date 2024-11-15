import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './PendingPage.css';
import pendingImage from './images/pending.png'; // Asegúrate de tener una imagen para estado pendiente

function PendingPage() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    setOrderDetails(storedOrderDetails);
  }, []);

  return (
    <div className="pending-page container mx-auto p-6 lg:max-w-4xl text-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Mensaje de compra en proceso */}
        <div className="mb-6">
          <img 
            src={pendingImage}
            alt="Compra en proceso" 
            className="w-16 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-extrabold text-yellow-600 mb-2">¡Compra en proceso!</h1>
          <p className="text-gray-700 text-lg">Tu compra está en proceso de verificación. Te notificaremos cuando el pago sea confirmado.</p>
        </div>

        {/* Resumen del pedido */}
        {orderDetails && orderDetails.items ? (
          <div className="order-summary bg-gray-50 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>
            <ul className="text-left space-y-4">
              {orderDetails.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b py-4">
                  <div>
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
          <p className="text-red-500 mt-4">No se pudo obtener el resumen de la compra.</p>
        )}

        {/* Botones de acción */}
        <div className="mt-10 flex flex-col lg:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-full lg:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Volver al inicio
          </button>
          <button 
            onClick={() => navigate('/perfil')} 
            className="w-full lg:w-auto bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Ver estado del pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default PendingPage;
