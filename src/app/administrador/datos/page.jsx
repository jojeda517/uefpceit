"use client";
import React from "react";
import { useState, useEffect } from "react";

function Datos() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [countryCode, setCountryCode] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Manejar el click para abrir el selector de archivos
  const handleFileClick = () => {
    document.getElementById("foto").click();
  };

  // Manejar el cambio de archivos a través del input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Manejar el evento de arrastre y soltar
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Prevenir el comportamiento predeterminado para permitir el arrastre
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const listCountries = countries.map((country) => ({
          name: country.name.common,
          idd: country.idd
            ? Array.isArray(country.idd.suffixes) &&
              country.idd.suffixes.length > 0
              ? country.idd.suffixes.length > 1
                ? country.idd.root
                : `${country.idd.root}`
              : country.idd.root
            : "ddd" /* poner ecuador por defecto */,
          flags: country.flags.svg,
        }));
        listCountries.sort((a, b) => a.name.localeCompare(b.name));
        setCountryCode(listCountries);
      } catch (error) {
        console.error("Error fetching country code:", error);
        setCountryCode([]);
      }
    };

    fetchCountryCode();
  }, []);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleCountrySelection = (country) => {
    setSelectedCountry(country);
    setFormData((prevState) => ({
      ...prevState,
      code: country.idd,
    }));
    setMenuAbierto(false); // Cerrar el menú desplegable después de seleccionar un país
  };
  return (
    <div className="bg-[url('/img/backgraund/mesa2.jpg')] bg-cover bg-fixed bg-center w-full flex justify-center pt-24 pb-10">
      <div className="w-7/12">
        <form className="max-w-7/12 m-auto p-10 bg-black bg-opacity-35 rounded-3xl shadow-xl overflow-hidden border border-blue-900">
          <div>
            <h2 className="font-extrabold text-3xl text-white">
              Actualizar Perfil
            </h2>
            <p className="font-light text-lg text-white">
              Actualiza tu información de perfil.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="cedula"
                className="block mb-2 text-sm font-medium text-white"
              >
                Número de Cédula
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  pattern="\d{10}"
                  id="cedula"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="9999999999"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-white"
              >
                Campus
              </label>
              <select
                id="countries"
                className="bg-white border border-blue-900 text-black text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
              >
                <option defaultValue={"Selecciona"}>
                  Selecciona el Campus
                </option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block mb-2 text-sm font-medium text-white"
              >
                Correo
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  id="correo"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="ejemplo@gmail.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block mb-2 text-sm font-medium text-white"
              >
                Contraseña
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  id="contrasena"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="********"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nombre"
                className="block mb-2 text-sm font-medium text-white"
              >
                Nombres
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Juan Antonio"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block mb-2 text-sm font-medium text-white"
              >
                Apellidos
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="apellido"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Pérez López"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="direccion"
                className="block mb-2 text-sm font-medium text-white"
              >
                Dirección
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="direccion"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Calle S/N"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fechaNacimiento"
                className="block mb-2 text-sm font-medium text-white"
              >
                Fecha de Nacimiento
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                </span>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="dd/mm/aaaa"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="pais"
                className="block mb-2 text-sm font-medium text-white"
              >
                País
              </label>
              <div className="flex items-center">
                <button
                  id="dropdown-phone-button"
                  name="code"
                  data-dropdown-toggle="dropdown-phone"
                  className="inline-flex items-center py-2.5 px-1.5 text-sm font-medium text-center border rounded-s-lg focus:ring-4 focus:outline-none bg-blue-900 hover:bg-blue-gray-100 focus:ring-blue-900 text-white border-blue-900 w-auto"
                  type="button"
                  onClick={toggleMenu}
                >
                  {selectedCountry ? (
                    <span className="flex me-2.5">
                      <img
                        src={selectedCountry.flags}
                        alt={selectedCountry.name}
                        className="w-4 h-4 me-1"
                      />
                      ({selectedCountry.idd})
                    </span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                      />
                    </svg>
                  )}
                </button>
                {menuAbierto && (
                  <div
                    id="pais"
                    className="absolute z-10 divide-y divide-red-500 rounded-lg shadow w-auto max-h-52 bg-blue-900 overflow-y-auto border border-blue-gray-100"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <ul
                      className="py-2 text-sm text-white"
                      aria-labelledby="dropdown-phone-button"
                    >
                      {countryCode.map((country) => (
                        <li key={country.name}>
                          <button
                            type="button"
                            className="inline-flex w-full px-4 py-2 text-sm text-white hover:bg-blue-gray-100 hover:text-black"
                            role="menuitem"
                            onClick={() => handleCountrySelection(country)}
                          >
                            <span className="inline-flex items-center">
                              <img
                                src={country.flags}
                                alt={country.name}
                                className="w-4 h-4 me-2"
                              />
                              {country.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <label
                  htmlFor="pais"
                  className="mb-2 text-sm font-medium sr-only text-white"
                >
                  País:
                </label>
                <div className="w-full">
                  <input
                    type="text"
                    id="pais"
                    name="phone"
                    className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                    /* pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" */
                    pattern="[0-9]{10}"
                    placeholder="123-456-7890"
                    /* value={formData.phone} */
                    /* onChange={handleChange} */
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block mb-2 text-sm font-medium text-white"
              >
                Teléfono
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </span>
                <input
                  type="tel"
                  id="telefono"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="0999999999"
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="flex items-center me-4">
                <input
                  id="deshabilitado"
                  type="radio"
                  value=""
                  name="colored-radio"
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="deshabilitado"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Deshabilitado
                </label>
              </div>
              <div className="flex items-center me-4">
                <input
                  id="habilitado"
                  type="radio"
                  value=""
                  name="colored-radio"
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="habilitado"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Habilitado
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Datos;
