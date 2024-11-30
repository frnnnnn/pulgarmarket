import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/orders/order-detail/${orderId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
              "Content-Type": "application/json",
            },
          }
        );

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

    // Llama la función una vez al cargar la página
    fetchOrderDetail();

    // Configura polling cada 5 segundos
    const interval = setInterval(fetchOrderDetail, 5000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [orderId]);

  // Define el estado actual basado en el estado del pedido
  const getPhase = () => {
    switch (order?.status) {
      case "procesando":
        return 1;
      case "recogiendo":
        return 2;
      case "listo":
        return 3;
      case "entregado":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="order-details-container container mx-auto p-6 lg:max-w-4xl">
      <button
        onClick={() => navigate("/mis-pedidos")}
        className="mb-4 text-blue-500 underline hover:text-blue-700"
      >
        Volver a mis pedidos
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {order ? (
        <div className="order-details bg-white shadow-md rounded-lg p-6">
          <div className="pickup-code text-center bg-green-100 text-green-800 font-bold text-2xl p-4 rounded-lg mb-6">
            Código de Retiro: {order.pickup_code}
          </div>
          <div className="progress-bar-container flex justify-between items-center mb-6">
            <div className={`progress-step ${getPhase() >= 1 ? "active" : ""}`}>
              <div className="circle">1</div>
              <p>Procesando</p>
            </div>
            <div className={`progress-line ${getPhase() >= 2 ? "active" : ""}`}></div>
            <div className={`progress-step ${getPhase() >= 2 ? "active" : ""}`}>
              <div className="circle">2</div>
              <p>Recogiendo productos</p>
            </div>
            <div className={`progress-line ${getPhase() >= 3 ? "active" : ""}`}></div>
            <div className={`progress-step ${getPhase() >= 3 ? "active" : ""}`}>
              <div className="circle">3</div>
              <p>Listo para retirar</p>
            </div>
            <div className={`progress-line ${getPhase() >= 4 ? "active" : ""}`}></div>
            <div className={`progress-step ${getPhase() >= 4 ? "active" : ""}`}>
              <div className="circle">4</div>
              <p>Entregado</p>
            </div>
          </div>
          <div className="gif-container text-center mb-6">
            {getPhase() === 1 && (
              <img
                src="https://cdn.dribbble.com/users/602333/screenshots/3658518/without-mockup-3.gif"
                alt="Procesando"
                className="mx-auto"
              />
            )}
            {getPhase() === 2 && (
              <img
                src="https://cdn.dribbble.com/users/3874322/screenshots/15083246/urb_supermarket.gif"
                alt="Recogiendo productos"
                className="mx-auto"
              />
            )}
            {getPhase() === 3 && (
              <div className="map-container flex justify-center">
                <iframe
                  title="Ubicación de recogida"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8609.947949472382!2d-72.35620084115085!3d-39.642947348572235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96143f8aa64afe05%3A0xb3566586b6e6bde8!2sSUPERMERCADO%20MATUS!5e1!3m2!1ses-419!2scl!4v1732503616535!5m2!1ses-419!2scl"
                  width="600"
                  height="450"
                  style={{ border: "0", borderRadius: "10px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
            {getPhase() === 4 && (
              <img
                src="https://i.pinimg.com/originals/90/13/f7/9013f7b5eb6db0f41f4fd51d989491e7.gif"
                alt="Entregado"
                className="mx-auto"
              />
            )}
          </div>
          <p className="text-lg font-semibold mb-2">Total: ${parseFloat(order.total)}</p>
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
                <p className="text-lg font-semibold">${(item.price * item.quantity)}</p>
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

export default OrderDetails;
