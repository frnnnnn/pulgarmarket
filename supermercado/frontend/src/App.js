// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductoCard from './ProductoCard';
import Header from './Header';
import './ProductoCard.css';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/LoginModal';
import Register from './components/RegisterModal';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MiPerfil from './components/MiPerfil';
import Carrito from './components/Carrito';
import SliderPrincipal from './components/SliderPrincipal';
import CarritoDetalle from './components/CarritoDetalle';
import SuccessPage from './components/SuccessPage';
import FailurePage from './components/FailurePage';
import PendingPage from './components/PendingPage';
import ProductDetailPage from './components/ProductDetailPage';
import MisPedidos from './components/MisPedidos';
import OrderDetails from './components/OrderDetails';
import CircularIndeterminate from './components/CircularIndeterminate';
import { formatPrice } from './utils/utils';
import AdminDashboard from './components/AdminDashboard';
import AdminOrders from "./components/AdminOrders";
import AdminOrderDetails from "./components/AdminOrderDetails";
import AdminProducts from "./components/AdminProducts";
import AdminUsers from "./components/AdminUsers";
import CategoriaBar from './components/CategoriaBar'; // Importar el nuevo componente
import { isAuthenticated } from './utils/auth';


function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Estado para la categoría seleccionada
  const [error, setError] = useState(null); // Estado para errores de productos
  const [loading, setLoading] = useState(false); // Estado para la carga de productos

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        let url = 'http://127.0.0.1:8000/products/';
        if (categoriaSeleccionada) {
          url += `?categoria=${categoriaSeleccionada}`; // Supone que la API acepta un parámetro 'categoria'
        }
        const response = await axios.get(url);
        setProductos(response.data);
        setError(null);
      } catch (err) {
        console.error("Hubo un error al obtener los productos!", err);
        setError("No se pudieron cargar los productos.");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaSeleccionada]); // Re-fetch cuando cambia la categoría

  useEffect(() => {
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
    ).filter(item => item.cantidad > 0);

    guardarCarritoEnLocalStorage(nuevoCarrito);
  };

  return (
    <Router>
      <Header carritoAbierto={carritoAbierto} setCarritoAbierto={setCarritoAbierto} carrito={carrito} />
      <Carrito
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        abierto={carritoAbierto}
        setAbierto={setCarritoAbierto}
      />

      <div className="container mx-auto max-w-screen-lg p-4">
        <Routes>
          <Route path="/perfil" element={isAuthenticated() ? <MiPerfil /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/revisar-carrito" element={
            <CarritoDetalle
              carrito={carrito}
              actualizarCantidad={actualizarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
            />
          } />
          <Route path="/" element={
            <div className="text-center">
              <SliderPrincipal />
              <h1 className="text-3xl font-bold mb-8">Catálogo de Productos</h1>
              <div className="flex flex-col lg:flex-row">
                {/* Barra de Categorías */}
                <div className="lg:w-1/4 mb-6 lg:mb-0 lg:pr-4">
                  <CategoriaBar 
                    categoriaSeleccionada={categoriaSeleccionada} 
                    setCategoriaSeleccionada={setCategoriaSeleccionada} 
                  />
                </div>
                {/* Lista de Productos */}
                <div className="lg:w-3/4">
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {loading ? (
                      <div className="flex justify-center items-center col-span-full">
                        <CircularIndeterminate />
                      </div>
                    ) : (
                      productos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center col-span-full">
                          <p className="text-gray-700 text-lg mb-4">No hay productos disponibles en esta categoría.</p>
                          <button
                            onClick={() => setCategoriaSeleccionada(null)}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                          >
                            Ver Todas las Categorías
                          </button>
                        </div>
                      ) : (
                        productos.map(producto => (
                          <ProductoCard
                            key={producto.id}
                            producto={producto}
                            agregarAlCarrito={agregarAlCarrito}
                            precioFormateado={formatPrice(producto.precio)}
                          />
                        ))
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          } />

          <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
          <Route path="/failure" element={<ProtectedRoute><FailurePage /></ProtectedRoute>} />
          <Route path="/pending" element={<ProtectedRoute><PendingPage /></ProtectedRoute>} />
          <Route path="/:slug" element={<ProductDetailPage agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/mis-pedidos" element={<ProtectedRoute><MisPedidos /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />

          {/* Rutas del panel de administración */}
          <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/dashboard/orders/:orderId" element={<ProtectedRoute><AdminOrderDetails /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
          <Route path="/dashboard/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

          {/* Redirigir a la página principal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
