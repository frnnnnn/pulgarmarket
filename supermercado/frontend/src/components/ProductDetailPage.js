import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './ProductDetailPage.css'; // Puedes seguir usando CSS personalizado si es necesario

function ProductDetailPage({ agregarAlCarrito }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Función para obtener los datos del producto
  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/products/${slug}/`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error('Error al cargar el producto:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const handleAgregarAlCarrito = () => {
    if (product) {
      agregarAlCarrito(product, cantidad);
      toast.success(`${cantidad} x ${product.nombre} ha sido añadido al carrito`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error al cargar el producto. Por favor, intenta nuevamente más tarde.</p>
      </div>
    );
  }

  return (
    <div className="product-detail container mx-auto p-6 lg:max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Imagen del Producto */}
        <div className="product-image flex-1">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
            loading="lazy"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="product-info flex-1 flex flex-col">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.nombre}</h1>
          <p className="text-lg text-gray-600 mb-2">Stock disponible: <span className="font-medium">{product.stock}</span></p>
          <p className="text-sm text-gray-400 mb-4">SKU: <span className="font-medium">{product.id}</span></p>
          
          {/* Precio */}
          <p className="text-3xl text-red-600 font-bold mb-6">${product.precio.toLocaleString()}</p>

          {/* Selección de Cantidad */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="bg-gray-300 text-gray-800 p-2 rounded-l hover:bg-gray-400 transition"
              aria-label="Disminuir cantidad"
            >
              <FaMinus />
            </button>
            <span className="px-4 text-lg">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="bg-gray-300 text-gray-800 p-2 rounded-r hover:bg-gray-400 transition"
              aria-label="Aumentar cantidad"
            >
              <FaPlus />
            </button>
          </div>

          {/* Botón de Agregar */}
          <button
            onClick={handleAgregarAlCarrito}
            className="flex items-center bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition"
          >
            <FaShoppingCart className="mr-2" />
            Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="product-description mt-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Información del Producto</h3>
        <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
      </div>

      {/* Contenedor de Toast */}
      <ToastContainer />
    </div>
  );
}

export default ProductDetailPage;
