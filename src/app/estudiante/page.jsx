"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";

function Estudiante() {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];

  // Contenido de la página de administrador
  return (
    <div className="bg-pink-500 w-full h-full">
      <Sidebar roles={roles} />
      <h1 className="text-blue-600">Página de Estudiante</h1>
    </div>
  );
}

export default Estudiante;
