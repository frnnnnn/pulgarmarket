import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SuccessPage.css";
import checkedImage from "./images/checked.png";
import CircularIndeterminate from "./CircularIndeterminate";

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmarPedido = async () => {
      try {
        // Obtener el order_id de la URL
        const queryParams = new URLSearchParams(location.search);
        const order_id = queryParams.get("order_id");

        if (!order_id) {
          setError("ID del pedido no proporcionado.");
          return;
        }

        // Solicitar al backend los detalles del pedido
        const response = await fetch(
          `http://127.0.0.1:8000/payments/success/?order_id=${order_id}`,
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
          setOrderDetails(data); // Guardar los detalles de la orden confirmada
          localStorage.removeItem("pedido"); // Limpiar datos del pedido almacenado
          localStorage.removeItem("carrito"); // Limpiar el carrito de localStorage
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
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">
            ¡Compra exitosa!
          </h1>
          <p className="text-gray-700 text-lg">
            Gracias por tu compra. Este es tu código de retiro:
          </p>

          {orderDetails?.pickup_code && (
            <div className="pickup-code bg-blue-100 text-blue-800 font-bold text-2xl p-4 rounded-lg mt-6">
              Código: {orderDetails.pickup_code}
            </div>
          )}
        </div>

        {orderDetails && orderDetails.items ? (
          <div className="order-summary bg-gray-50 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>
            <ul className="text-left space-y-4">
              {orderDetails.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.nombre}</h3>
                    <p className="text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    ${(item.quantity * item.price)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right text-xl font-bold">
              <p>Total: ${(orderDetails.total)}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 mt-4">
            {error || <CircularIndeterminate />}
          </p>
        )}

        <div className="mt-10 flex flex-col lg:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full lg:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Seguir comprando
          </button>
          <button
            onClick={() => navigate("/mis-pedidos")}
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
