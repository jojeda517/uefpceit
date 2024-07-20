import React from 'react';
import Sidebar from '../components/Sidebar';

function Admin() {
    
  
    // Contenido de la página de administrador
    return (
      <div className='bg-pink-500 w-full h-full'>
        <Sidebar></Sidebar>
        <h1 className='text-red-600'>Página de Administrador</h1>
      </div>
    );
  }
  

export default Admin;
