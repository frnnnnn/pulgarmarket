import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';

function ProductDetailPage({ agregarAlCarrito }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${slug}/`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos del producto:", data);
        setProduct(data);
      })
      .catch((error) => console.error("Error al cargar el producto:", error));
  }, [slug]);

  const handleAgregarAlCarrito = () => {
    if (product) {
      agregarAlCarrito(product, cantidad); // Llama a agregarAlCarrito con el producto y la cantidad
      alert(`${cantidad} x ${product.nombre} ha sido añadido al carrito`);
    }
  };

  if (!product) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="product-detail container mx-auto p-6 lg:max-w-4xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagen del Producto */}
        <div className="product-image">
          <img src={product.imagen} alt={product.nombre} className="w-full h-auto" />
        </div>

        {/* Detalles del Producto */}
        <div className="product-info flex-grow">
          <h1 className="text-3xl font-bold">{product.nombre}</h1>
          <p className="text-gray-600 mb-4">Stock disponible: {product.stock}</p>
          <p className="text-sm text-gray-400">SKU: {product.id}</p>
          
          {/* Precio */}
          <p className="text-4xl text-red-500 font-bold mb-4">${product.precio}</p>

          {/* Selección de Cantidad */}
          <div className="flex items-center mb-4">
            <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="bg-gray-300 text-gray-800 px-3 py-1 rounded-l">-</button>
            <span className="px-4">{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded-r">+</button>
          </div>

          {/* Botón de Agregar */}
          <button onClick={handleAgregarAlCarrito} className="add-to-cart-btn bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700">
            Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="product-description mt-8">
        <h3 className="text-xl font-semibold mb-4">Información del producto</h3>
        <p className="text-gray-700">{product.descripcion}</p>
      </div>
    </div>
  );
}

export default ProductDetailPage;
