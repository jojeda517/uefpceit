"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Admin() {
    const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
    const router = useRouter();

    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          const response = await fetch('URL_DEL_ENDPOINT_DEL_BACKEND', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken'), // Ejemplo: si utilizas tokens de acceso JWT
            },
          });
  
          if (!response.ok) {
            throw new Error('Error al obtener el rol del usuario');
          }
  
          const userData = await response.json();
          setUserRole(userData.role);
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        }
      };
  
      fetchUserRole();
    }, []);
  
    useEffect(() => {
      if (userRole !== 'Admin') {
        router.push('/');
      }
    }, [userRole, router]);
  
    // Contenido de la página de administrador
    return (
      <div>
        <h1>Página de Administrador</h1>
      </div>
    );
  }
  

export default Admin;
