"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Estudiante() {
    const router = useRouter();

    useEffect(() => {
      // Verificar si el usuario tiene el rol de administrador
      const userRole = "Estudiante"; // Ejemplo: obtener el rol real del usuario
  
      if (userRole !== "Estudiante") {
        // Si el usuario no es administrador, redirigir a una página no autorizada
        router.push("/");
      }
    }, [router]);
  
    return (
      <div>
        {/* Contenido de la página de administrador */}
        <h1>Página de Estudiante</h1>
      </div>
    );
  }

export default Estudiante