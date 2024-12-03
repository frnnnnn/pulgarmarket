import React from "react";
import { Link } from "react-router-dom";

function SidebarAdmin({ sidebarOpen, toggleSidebar }) {
  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } lg:block bg-blue-900 text-white w-64 h-screen shadow-xl fixed top-0 left-0 z-30 transition-all duration-300`}
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/orders"
              className="block px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition"
            >
              Gestión de Pedidos
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/products"
              className="block px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition"
            >
              Gestión de Productos
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/users"
              className="block px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition"
            >
              Gestión de Usuarios
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="block px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition mt-10"
            >
              Volver al Inicio
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SidebarAdmin;
