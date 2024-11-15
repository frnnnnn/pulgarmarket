import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSearch, FiShoppingCart } from 'react-icons/fi';
import './Header.css';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function Header({ carrito, carritoAbierto, setCarritoAbierto }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Calcular el número total de artículos en el carrito
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <header className="bg-white shadow-md w-full">
      <div className="hidden md:flex container mx-auto max-w-screen-lg justify-between items-center p-4">
        <div className="flex items-center">
          <a href="/">
            <img src={`${process.env.PUBLIC_URL}/logo-header.png`} alt="Logo" className="h-20" />
          </a>
        </div>

        <div className="flex-grow mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="barra p-2 border border-gray-300 rounded-full pl-4"
            />
            <button className="absolute top-0 right-0 h-full px-4 bg-green-500 rounded-r-full text-white">
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <img src={`${process.env.PUBLIC_URL}/svg/account-svgrepo-com.svg`} alt="perfil" className="h-7" />
                <Link to="/perfil" className="text-gray-700 font-semibold">Mi Perfil</Link>
                <Link to="/mis-pedidos" className="text-gray-700 font-semibold">Mis Pedidos</Link> {/* Agregado enlace a Mis Pedidos */}
              </div>
              <button onClick={handleLogout} className="text-red-500 font-semibold">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-start space-y-1">
                <span className="text-gray-500 font-semibold">Hola, Inicia sesión</span>
                <button className="text-green-500 font-semibold">
                  <span onClick={() => setLoginOpen(true)}>Ingresa</span> o <span onClick={() => setRegisterOpen(true)}>Regístrate</span>
                </button>
              </div>
            </>
          )}
          <button onClick={() => setCarritoAbierto(!carritoAbierto)} className="relative">
            <FiShoppingCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="md:hidden flex justify-between items-center p-4">
        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl">
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className="flex-1 flex justify-center">
          <a href="/">
            <img src={`${process.env.PUBLIC_URL}/logo-header.png`} alt="Logo" className="h-8" />
          </a>
        </div>

        <button onClick={() => setCarritoAbierto(!carritoAbierto)} className="relative">
          <FiShoppingCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 mb-2 md:hidden">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="¿Qué productos necesitas hoy?"
            className="w-full p-2 border border-gray-300 rounded-full pl-4"
          />
          <button className="absolute top-0 right-0 h-full px-4 bg-gray-200 rounded-r-full text-gray-600">
            <FiSearch />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <div className="flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="text-gray-700 font-semibold">Mi Perfil</Link>
                <Link to="/mis-pedidos" className="text-gray-700 font-semibold">Mis Pedidos</Link> {/* Agregado enlace a Mis Pedidos en móvil */}
                <button onClick={handleLogout} className="text-red-500 font-semibold">Cerrar Sesión</button>
              </>
            ) : (
              <button className="text-green-500 font-semibold" onClick={() => setLoginOpen(true)}>
                Ingresa o Regístrate
              </button>
            )}
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} setIsAuthenticated={setIsAuthenticated} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} setIsAuthenticated={setIsAuthenticated} />
    </header>
  );
}

export default Header;
