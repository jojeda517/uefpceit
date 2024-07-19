"use client"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

function Docente() {
  const [email, setEmail] = useState(null);
  useEffect(()=>{
    const email = localStorage.getItem('email');

    setEmail(email);
  })

  return (
    <div>
      <h1>Docente</h1>
      <p>Bienvenido {email}</p>
      <button onClick={() => signOut(
        { callbackUrl: 'http://localhost:3000/' }
      )}>Cerrar sesión</button>
    </div>
  )
}

export default Docente