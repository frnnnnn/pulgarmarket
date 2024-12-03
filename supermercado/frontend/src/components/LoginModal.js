import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
        username: username,
        password: password,
      });

      // Guardar el token JWT en el almacenamiento local (localStorage)
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // Redirigir según el rol del usuario
      const isAdmin = response.data.is_admin; // Asegúrate de que `is_admin` viene en la respuesta
      localStorage.setItem('is_admin', isAdmin);

      setIsAuthenticated(true); // Actualiza el estado en el Header

      if (isAdmin) {
        navigate('/dashboard'); // Redirige al dashboard si es administrador
      } else {
        navigate('/'); // Redirige al inicio si es usuario regular
      }

      alert('Login exitoso');
      onClose(); // Cerrar el modal después de iniciar sesión
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      setError('Nombre de usuario o contraseña incorrectos.');
    }
  };

  if (!isOpen) return null; // No renderizar nada si el modal está cerrado

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <button
          className="mt-4 text-red-500 hover:underline"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
