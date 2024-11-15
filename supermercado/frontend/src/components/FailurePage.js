import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import errorImage from './images/error.png'; // Asegúrate de tener una imagen de error

function FailurePage() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const storedOrderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    setOrderDetails(storedOrderDetails);
  }, []);

  return (
    <div className="failure-page container mx-auto p-6 lg:max-w-4xl text-center">
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Mensaje de fallo en la compra */}
        <div className="mb-6">
          <img 
            src={errorImage}
            alt="Compra fallida" 
            className="w-16 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">¡Lo sentimos, algo salió mal!</h1>
          <p className="text-gray-700 text-lg">No se pudo completar tu compra. Inténtalo nuevamente o contacta a soporte si el problema persiste.</p>
        </div>

        {/* Resumen del pedido (opcional) */}
        {orderDetails && orderDetails.items ? (
          <div className="order-summary bg-gray-50 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-4">Resumen de tu intento de compra</h2>
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
          <p className="text-red-500 mt-4">No se pudo obtener el resumen de tu intento de compra.</p>
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
            onClick={() => navigate('/soporte')} 
            className="w-full lg:w-auto bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Contactar soporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default FailurePage;
