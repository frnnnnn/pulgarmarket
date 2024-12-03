import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "./SidebarAdmin"; // Importamos SidebarAdmin

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/admin/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        console.log(response.data); 
        setUsers(response.data);
      } catch (err) {
        console.error("Error al cargar los usuarios:", err);
        setError("Hubo un problema al cargar los usuarios.");
      }
    };

    fetchUsers();
  }, []);

  const renderUsers = () => {
    if (users.length === 0) {
      return <p>No hay usuarios disponibles.</p>;
    }

    return (
      <table className="table-auto w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre de Usuario</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Roles</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                {user.is_active ? (
                  <span className="text-green-500 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-500 font-semibold">Inactivo</span>
                )}
              </td>
              <td className="px-4 py-2">
                {user.is_staff ? "Administrador" : "Usuario"}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mr-2"
                  onClick={() => alert("Editar funcionalidad aquí")}
                >
                  Editar
                </button>
                <button
                  className={`${
                    user.is_active ? "bg-red-500" : "bg-green-500"
                  } text-white px-3 py-1 rounded hover:bg-opacity-80 transition`}
                  onClick={() => alert("Desactivar/activar funcionalidad aquí")}
                >
                  {user.is_active ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarAdmin /> 

      <div className="p-6 w-full ml-64">
        <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto">{renderUsers()}</div>
      </div>
    </div>
  );
}

export default AdminUsers;
