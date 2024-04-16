"use client"
import { signOut } from "next-auth/react"

function Docente() {
  return (
    <div>
      <h1>Docente</h1>
      <button onClick={() => signOut()}>Cerrar sesión</button>
    </div>
  )
}

export default Docente