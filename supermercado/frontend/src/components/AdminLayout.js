import React from "react";
import { Outlet } from "react-router-dom";
//import AdminSidebar from "./AdminSidebar"; // Sidebar para Admin

function AdminLayout() {
  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <Outlet /> {/* Aquí se renderizan las rutas anidadas */}
      </div>
    </div>
  );
}

export default AdminLayout;
