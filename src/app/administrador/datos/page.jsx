"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function Datos() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [cedula, setCedula] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    nacionalidad: "",
    direccion: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
  });
  const [roles, setRoles] = useState({
    administrador: false,
    docente: true,
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch("/api/campus");
        const data = await response.json();
        setCampuses(data);
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    };

    fetchCampuses();
  }, []);

  const handleSelectCampus = (campus) => {
    setSelectedCampus(campus);
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el cambio en el campo de cédula
  const handleCedulaChange = async (event) => {
    try {
      // Hacer la petición al endpoint
      const response = await fetch(`/api/persona/docente/${cedula}`);
      const data = await response.json();

      // Verificar si se recibieron datos y actualizar el estado del formulario
      if (data) {
        const roles = data.usuario.roles.reduce(
          (acc, role) => {
            acc[role.rol.toLowerCase()] = true;
            console.log(acc);
            return acc;
          },
          {
            administrador: false,
            docente: false,
          }
        );
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.usuario.correo,
          contrasena: data.usuario.contrasena,
          nacionalidad: data.nacionalidad,
          direccion: data.direccion,
          telefono: data.telefono,
          fechaNacimiento: new Date(data.fechaNacimiento)
            .toISOString()
            .split("T")[0],
          genero: data.sexo,
        });
        setRoles(roles);

        // Seleccionar automáticamente el campus
        const selectedCampus = campuses.find(
          (campus) => campus.id === data.idCampusPertenece
        );
        setSelectedCampus(selectedCampus);
        console.log(data);
      } else {
        setFormData(null); // Limpiar datos si no se encuentra la cédula
        setRoles({
          administrador: false,
          docente: true, // Deja el rol de docente marcado por defecto
        });
        setSelectedCampus(null); // Limpiar el campus seleccionado
      }
    } catch (error) {
      console.error("Error fetching data:");
      setFormData(null); // Limpiar datos en caso de error
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

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

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setRoles({
      ...roles,
      [name]: checked,
    });
  };

  return (
    <div className="bg-gray-100 w-full flex justify-center pt-24 pb-10">
      <div className="w-full">
        <form className="px-10">
          <div className="grid grid-cols-1 gap-2 pb-5">
            <h2 className="font-extrabold text-3xl text-blue-900">
              Actualizar Perfil
            </h2>
            <p className="font-light text-lg text-black">
              Información personal
            </p>
          </div>
          <div className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            <div className="grid row-span-3 justify-items-center content-center">
              <div
                htmlFor="foto"
                className="flex flex-col items-center justify-center w-52 h-52 border-2 border-blue-900 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-blue-gray-50"
                onClick={handleFileClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-full w-full object-cover w-52 h-52 rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-14 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haga clic</span> o
                      arrastre y suelte
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      SVG, PNG, JPG o GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  id="foto"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif, image/svg+xml"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="">
              <label
                htmlFor="cedula"
                className="block mb-2 text-sm font-medium text-blue-900"
              >
                Número de cédula
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
                  onChange={(e) => setCedula(e.target.value)}
                />
                <div
                  /* enviar el valor de cedula en el oncklick */
                  onClick={handleCedulaChange}
                  className="ml-2 px-3 text-sm bg-blue-900 hover:bg-blue-gray-100 hover:text-blue-900 text-white border border-blue-900 rounded-lg cursor-pointer flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Campus
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
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
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                      />
                    </svg>
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">
                      {selectedCampus ? (
                        <>
                          <strong>{selectedCampus.nombre}</strong> - (
                          {selectedCampus.direccion})
                        </>
                      ) : (
                        "Seleccione un campus"
                      )}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1 cursor-pointer">
                    {campuses.map((campus) => (
                      <MenuItem
                        key={campus.id}
                        onClick={() => handleSelectCampus(campus)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900 block px-4 py-2 text-sm text-gray-900">
                          <strong>{campus.nombre}</strong> - ({campus.direccion}
                          )
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block mb-2 text-sm font-medium text-blue-900"
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
                  name="correo"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="ejemplo@gmail.com"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block mb-2 text-sm font-medium text-blue-900"
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
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  className="rounded-none bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="********"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
                <div
                  onClick={togglePasswordVisibility}
                  className=" px-3 text-sm bg-blue-900 hover:bg-blue-gray-100 hover:text-blue-900 text-white border border-blue-900 rounded-e-lg cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="nombre"
                className="block mb-2 text-sm font-medium text-blue-900"
              >
                Nombres
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-lg">
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
                  name="nombre"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Juan Antonio"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block mb-2 text-sm font-medium text-blue-900"
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
                  name="apellido"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Pérez López"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nacionalidad"
                className="block mb-2 text-sm font-medium text-blue-900"
              >
                Nacionalidad
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
                      d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  id="nacionalidad"
                  name="nacionalidad"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Ecuatoriana"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fechaNacimiento"
                className="block mb-2 text-sm font-medium text-blue-900"
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
                  name="fechaNacimiento"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="dd/mm/aaaa"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Provincia
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
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
                        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                      />
                    </svg>
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">Seleccione una provincia</p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Provincia 1
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Provincia 2
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Provincia 3
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Provincia 4
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Provincia 5
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Cantón
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
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
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">Seleccione un cantón</p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Cantón 1
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Cantón 2
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Cantón 3
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Cantón 4
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Cantón 5
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Parroquia
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
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
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">Seleccione una parroquia</p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Parroquia 1
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Parroquia 2
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Parroquia 3
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Parroquia 4
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                        Parroquia 5
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div>
              <label
                htmlFor="direccion"
                className="block mb-2 text-sm font-medium text-blue-900"
              >
                Dirección
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
                  name="direccion"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="Calle S/N"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block mb-2 text-sm font-medium text-blue-900"
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
                  name="telefono"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="0999999999"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Género
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
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
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">
                      {formData.genero || "Seleccione un género"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1 cursor-pointer">
                    {["Masculino", "Femenino", "Otro"].map((option) => (
                      <MenuItem key={option}>
                        <a
                          onClick={() =>
                            setFormData({ ...formData, genero: option })
                          }
                          className={`data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900 block px-4 py-2 text-sm text-gray-900 ${
                            formData.genero === option ? "bg-blue-100" : ""
                          }`}
                        >
                          {option}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            {/* Add role checkboxes */}
            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900">
                Roles
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="administrador"
                  name="administrador"
                  checked={roles.administrador}
                  onChange={handleRoleChange}
                  className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                <label
                  htmlFor="administrador"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Administrador
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="docente"
                  name="docente"
                  checked={roles.docente}
                  onChange={handleRoleChange}
                  className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                <label
                  htmlFor="docente"
                  className="ml-2 text-sm font-medium text-gray-900"
                >
                  Docente
                </label>
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" />

            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black">
                Titulos Academicos
              </label>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-white font-serif text-2xl text-center">
                Ingeniero en Software
              </p>
            </div>
            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-white font-serif text-2xl text-center">
                Ingeniero en Software
              </p>
            </div>
            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-white font-serif text-2xl text-center">
                Ingeniero en Software
              </p>
            </div>
            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-white font-serif text-2xl text-center">
                Ingeniero en Software
              </p>
            </div>
            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <p className="text-white font-serif text-2xl text-center">
                Ingeniero en Software
              </p>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" />

            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black">
                Historial de Empleo
              </label>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <p className="text-white font-serif text-2xl mb-2">
                  Universidad Nacional
                </p>
                <p className="text-cyan-500 font-sans text-lg">
                  Profesor de Programación
                </p>
              </div>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <p className="text-white font-serif text-2xl mb-2">
                  Universidad Nacional
                </p>
                <p className="text-cyan-500 font-sans text-lg">
                  Profesor de Programación
                </p>
              </div>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <p className="text-white font-serif text-2xl mb-2">
                  Universidad Nacional
                </p>
                <p className="text-cyan-500 font-sans text-lg">
                  Profesor de Programación
                </p>
              </div>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <p className="text-white font-serif text-2xl mb-2">
                  Universidad Nacional
                </p>
                <p className="text-cyan-500 font-sans text-lg">
                  Profesor de Programación
                </p>
              </div>
            </div>

            <div className="bg-blue-900 py-5 px-2.5 rounded-3xl m-3 shadow-black shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <p className="text-white font-serif text-2xl mb-2">
                  Universidad Nacional
                </p>
                <p className="text-cyan-500 font-sans text-lg">
                  Profesor de Programación
                </p>
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" />

            {/* botones: cancelar, dar de baja al usuario, guardar */}
            <button className="bg-blue-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Guardar
            </button>
            <button className="bg-red-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Dar de Baja
            </button>
            <button className="bg-gray-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Cancelar
            </button>

            {/*  */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Datos;
