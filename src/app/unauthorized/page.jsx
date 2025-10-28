export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mt-4">
        No tienes permisos para acceder a esta página.
      </p>
      {/* <a href="/" className="mt-6 text-blue-500 underline">
        Volver al inicio
      </a> */}
    </div>
  );
}
