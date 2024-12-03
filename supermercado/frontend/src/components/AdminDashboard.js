import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";  // Importamos SidebarAdmin

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarAdmin sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Content Area */}
      <main className="flex-1 w-full p-6 lg:p-10 transition-all duration-300">
        {/* Mobile Sidebar Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="text-white bg-blue-900 p-2 rounded-md"
          >
            ☰
          </button>
        </div>

        {/* Main Header */}
        <header className="bg-white p-6 rounded-md shadow-md mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-700">Dashboard</h2>
          <div>
            <Link
              to="/dashboard/profile"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Mi Perfil
            </Link>
          </div>
        </header>

        {/* Content Section */}
        <section className="bg-white p-6 rounded-md shadow-md">
          <Outlet /> {/* Aquí se renderiza el contenido de las rutas anidadas */}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
