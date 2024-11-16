import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductoCard from './ProductoCard';
import Header from './Header';
import './ProductoCard.css';
import ProtectedRoute from './components/ProtectedRoute';  // Importa el Protected Route
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/LoginModal';
import Register from './components/RegisterModal';
import { isAuthenticated } from './utils/auth';
import MiPerfil from './components/MiPerfil';
import Carrito from './components/Carrito';
import SliderPrincipal from './components/SliderPrincipal';
import CarritoDetalle from './components/CarritoDetalle';
import SuccessPage from './components/SuccessPage';
import FailurePage from './components/FailurePage';
import PendingPage from './components/PendingPage';
import ProductDetailPage from './components/ProductDetailPage';
import MisPedidos from './components/MisPedidos';
import OrderDetails from "./components/OrderDetails";

  
function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    // Fetch de productos
    axios.get('http://127.0.0.1:8000/api/productos/')
      .then(response => setProductos(response.data))
      .catch(error => console.error("Hubo un error!", error));
  }, []);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const guardarCarritoEnLocalStorage = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const index = carrito.findIndex(item => item.producto.id === producto.id);
    let nuevoCarrito;

    if (index >= 0) {
      const nuevaCantidad = carrito[index].cantidad + cantidad;
      if (nuevaCantidad <= 0) {
        nuevoCarrito = carrito.filter(item => item.producto.id !== producto.id);
      } else {
        nuevoCarrito = carrito.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }
    } else {
      nuevoCarrito = [...carrito, { producto, cantidad }];
    }

    guardarCarritoEnLocalStorage(nuevoCarrito);
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item.producto.id !== id);
    guardarCarritoEnLocalStorage(nuevoCarrito);
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    const nuevoCarrito = carrito.map(item =>
      item.producto.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ).filter(item => item.cantidad > 0); // Elimina productos con cantidad <= 0

    guardarCarritoEnLocalStorage(nuevoCarrito);
  };

  return (
    <Router>
      <Header carritoAbierto={carritoAbierto} setCarritoAbierto={setCarritoAbierto} carrito={carrito} />
      
      {/* Carrito siempre presente para que se despliegue en cualquier página */}
      <Carrito
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        abierto={carritoAbierto}
        setAbierto={setCarritoAbierto}
      />

      <div className="container mx-auto max-w-screen-lg p-4">
        <Routes>
          <Route
            path="/perfil"
            element={isAuthenticated() ? <MiPerfil /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/revisar-carrito" element={
            <CarritoDetalle
              carrito={carrito}
              actualizarCantidad={actualizarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
            />
          } />
          <Route
            path="/"
            element={
              <div className="text-center">
                <SliderPrincipal />
                <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>
                <p className="border border-gray-300 p-4 mb-6">Estos son los productos disponibles en nuestro supermercado.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productos.length === 0 ? (
                    <p>No hay productos disponibles.</p>
                  ) : (
                    productos.map(producto => (
                      <ProductoCard
                        key={producto.id}
                        producto={producto}
                        agregarAlCarrito={agregarAlCarrito}
                      />
                    ))
                  )}
                </div>
              </div>
            }
          />
          <Route path="/success" element={<ProtectedRoute> <SuccessPage /> </ProtectedRoute>} />
          <Route path="/failure" element={<ProtectedRoute> <FailurePage /> </ProtectedRoute>} />
          <Route path="/pending" element={<ProtectedRoute> <PendingPage /> </ProtectedRoute>} />
          <Route path="/:slug" element={<ProductDetailPage agregarAlCarrito={agregarAlCarrito} />} /> {/* Ruta dinámica para cada producto */}
          <Route path="/mis-pedidos" element={<ProtectedRoute><MisPedidos /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
