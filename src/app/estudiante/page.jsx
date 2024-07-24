"use client";
import React from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";

function Estudiante() {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];

  // Contenido de la página de administrador
  return (
    <div>
      <Header />
    </div>
  );
}

export default Estudiante;
