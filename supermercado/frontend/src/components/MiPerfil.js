import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MiPerfil() {
  const [userData, setUserData] = useState(null);  
  const [editMode, setEditMode] = useState(false);  
  const [error, setError] = useState(null);  
  const [successMessage, setSuccessMessage] = useState('');  
  const [passwordData, setPasswordData] = useState({
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');  
  const [showPasswordForm, setShowPasswordForm] = useState(false);  // Controla la visibilidad del formulario de contraseña

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/auth/perfil/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error al obtener el perfil del usuario:", err);
        setError("No se pudo obtener el perfil. Por favor, intenta de nuevo.");
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.patch('http://127.0.0.1:8000/auth/perfil/', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setUserData(response.data);
      setEditMode(false);
      setSuccessMessage("Los cambios se guardaron correctamente.");
    } catch (err) {
      console.error("Error al actualizar el perfil del usuario:", err);
      setError("No se pudo guardar los cambios. Por favor, intenta de nuevo.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const response = await axios.post('http://127.0.0.1:8000/auth/cambiar-contrasena/', passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setPasswordMessage(response.data.success);
      setPasswordData({ contrasena_actual: '', nueva_contrasena: '', confirmar_contrasena: '' });
      setShowPasswordForm(false);  // Ocultar el formulario después de cambiar la contraseña
    } catch (err) {
      setPasswordMessage(err.response.data.error || "Error al cambiar la contraseña.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userData) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="rounded-full w-24 h-24"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold">{userData.username}</h2>
            <p className="text-gray-500">Miembro registrado</p>
            <button className="mt-2 text-purple-600 underline" onClick={toggleEditMode}>
              {editMode ? 'Cancelar' : 'Editar perfil'}
            </button>
          </div>
        </div>

        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

        <div className="mt-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${!editMode && 'bg-gray-100'}`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${!editMode && 'bg-gray-100'}`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Teléfono</label>
              <input
                type="text"
                name="phone"
                value={userData.phone || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${!editMode && 'bg-gray-100'}`}
              />
            </div>
            <div>
              <label className="block text-gray-700">Género</label>
              <select
                name="gender"
                value={userData.gender || ''}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${!editMode && 'bg-gray-100'}`}
              >
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
                <option value="Other">Otro</option>
              </select>
            </div>
          </form>

          {editMode && (
            <div className="mt-6">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md" onClick={handleSaveChanges}>
                Guardar cambios
              </button>
            </div>
          )}
        </div>

        {/* Botón para mostrar formulario de cambio de contraseña */}
        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {showPasswordForm ? 'Cancelar cambio de contraseña' : 'Cambiar Contraseña'}
          </button>

          {/* Formulario para cambiar contraseña */}
          {showPasswordForm && (
            <div className="mt-4">
              {passwordMessage && <p className="text-red-500">{passwordMessage}</p>}
              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700">Contraseña Actual</label>
                  <input
                    type="password"
                    name="contrasena_actual"
                    value={passwordData.contrasena_actual}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="nueva_contrasena"
                    value={passwordData.nueva_contrasena}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmar_contrasena"
                    value={passwordData.confirmar_contrasena}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md">
                  Guardar Nueva Contraseña
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
