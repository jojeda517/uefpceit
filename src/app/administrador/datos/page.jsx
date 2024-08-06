"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  IdentificationIcon,
  BuildingOffice2Icon,
  AtSymbolIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  GlobeAmericasIcon,
  CalendarDaysIcon,
  MapIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BriefcaseIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/20/solid";
import CircularProgress from "@mui/material/CircularProgress";
import { Chip } from "@nextui-org/chip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Input,
} from "@nextui-org/react";
import { Alert } from "@material-tailwind/react";

function Datos() {
  const [showPassword, setShowPassword] = useState(false);
  const [cedula, setCedula] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [foto, setFoto] = useState(null);
  const [titulos, setTitulos] = useState([]);
  const [searchTitulos, setSearchTitulos] = useState([]);
  const [searchExperiencias, setSearchExperiencias] = useState([]);
  const [experiencias, setExperiencias] = useState([]);
  const [addTitulo, setAddTitulo] = useState("");
  const [addExperiencia, setAddExperiencia] = useState("");
  const [addExperienciaCargo, setAddExperienciaCargo] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedCanton, setSelectedCanton] = useState(null);
  const [selectedParroquia, setSelectedParroquia] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [notificacion, setNotificacion] = useState(""); // Estado de error

  useEffect(() => {
    if (notificacion) {
      const timer = setTimeout(() => {
        setNotificacion("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notificacion]);

  const {
    isOpen: isOpenTitulo,
    onOpen: onOpenTitulo,
    onOpenChange: onOpenChangeTitulo,
  } = useDisclosure();
  const {
    isOpen: isOpenExperiencia,
    onOpen: onOpenExperiencia,
    onOpenChange: onOpenChangeExperiencia,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    nacionalidad: "",
    direccion: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "",
    experiencia: 0,
  });
  const [roles, setRoles] = useState({
    administrador: false,
    docente: true,
  });

  const handleAddTitulo = async () => {
    try {
      setIsLoading(true);
      if (addTitulo) {
        const response = await fetch("/api/titulo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ titulo: addTitulo }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (titulos.find((titulo) => titulo.id === result.titulo.id)) {
        } else {
          const newTitulo = {
            id: result.titulo.id,
            titulo: result.titulo.titulo,
          };
          //setTitulos((prevTitulos) => [...prevTitulos, newTitulo]);
          setTitulos([...titulos, newTitulo]);
        }
      }
    } catch (error) {
      console.error("Error al añadir título:", error);
    } finally {
      setAddTitulo("");
      setIsLoading(false);
    }
  };

  const handleCloseTitulo = (tituloToRemove) => {
    setTitulos(titulos.filter((titulo) => titulo !== tituloToRemove));
  };

  const handleCloseExperiencia = (experienciaToRemove) => {
    setExperiencias(
      experiencias.filter((experiencia) => experiencia !== experienciaToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formPOST = new FormData();
      // Agregar los datos del formulario
      // Si id no esta vacio se añade al formData
      if (formData.id) {
        formPOST.append("id", formData.id);
      } else {
      }
      formPOST.append("nombre", formData.nombre);
      formPOST.append("apellido", formData.apellido);
      formPOST.append("correo", formData.correo);
      formPOST.append("contrasena", formData.contrasena);
      formPOST.append("nacionalidad", formData.nacionalidad);
      formPOST.append("direccion", formData.direccion);
      formPOST.append("telefono", formData.telefono);
      formPOST.append("fechaNacimiento", "1999-01-24T12:08:43.000Z");
      formPOST.append("sexo", formData.genero);
      formPOST.append("tiempoExperiencia", formData.experiencia);
      formPOST.append("idCampusPertenece", selectedCampus.id);
      formPOST.append("idParroquiaPertenece", selectedParroquia.id);
      formPOST.append("cedula", cedula);

      // Agregar foto
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        formPOST.append("foto", blob);
      }

      // Agregar Títulos
      if (titulos.length > 0) {
        formPOST.append("titulos", JSON.stringify(titulos));
      }

      const response = await fetch("/api/persona/docente", {
        method: "POST",
        body: formPOST,
      });

      if (response.ok) {
        const result = await response.json();
        setNotificacion("Datos actualizados correctamente");
      } else {
        const error = await response.json();
        setNotificacion("Error al actualizar los datos");
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      setNotificacion("Error al actualizar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTitulos = async () => {
      try {
        const response = await fetch("/api/titulo");
        const data = await response.json();
        setSearchTitulos(data);
      } catch (error) {
        console.error("Error fetching titulos:", error);
      }
    };
    fetchTitulos();
  }, []);

  useEffect(() => {
    const fetchExperiencias = async () => {
      try {
        const response = await fetch("/api/experiencia");
        const data = await response.json();
        setSearchExperiencias(data);
      } catch (error) {
        console.error("Error fetching experiencias:", error);
      }
    };
    fetchExperiencias();
  }, []);

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

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await fetch("/api/provincia");
        const data = await response.json();
        setProvincias(data);
      } catch (error) {
        console.error("Error fetching provincias:", error);
      }
    };

    fetchProvincias();
  }, []);

  const handleSelectProvincia = (provincia) => {
    setSelectedProvincia(provincia);
  };

  useEffect(() => {
    const fetchCantones = async () => {
      if (selectedProvincia) {
        try {
          const response = await fetch(`/api/canton/${selectedProvincia.id}`);
          const data = await response.json();
          setCantones(data);

          // Selecciona automáticamente el cantón si es parte de los datos del usuario
          if (formData && formData.parroquia) {
            const selectedCanton = data.find(
              (canton) => canton.id === formData.parroquia.CANTON.id
            );
            setSelectedCanton(selectedCanton);
          }
        } catch (error) {
          console.error("Error fetching cantones:", error);
        }
      }
    };

    fetchCantones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvincia]);

  const handleSelectCanton = (canton) => {
    setSelectedCanton(canton);
  };

  useEffect(() => {
    const fetchParroquias = async () => {
      if (selectedCanton) {
        try {
          const response = await fetch(`/api/parroquia/${selectedCanton.id}`);
          const data = await response.json();
          setParroquias(data);

          // Selecciona automáticamente la parroquia si es parte de los datos del usuario
          if (formData && formData.parroquia) {
            const selectedParroquia = data.find(
              (parroquia) => parroquia.id === formData.parroquia.id
            );
            setSelectedParroquia(selectedParroquia);
          }
        } catch (error) {
          console.error("Error fetching parroquias:", error);
        }
      }
    };

    fetchParroquias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCanton]);

  const handleSelectParroquia = (parroquia) => {
    setSelectedParroquia(parroquia);
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
      setIsLoading(true); // Establece el estado de carga a true
      const response = await fetch(`/api/persona/docente/${cedula}`);
      const data = await response.json();

      if (data) {
        const roles = data.usuario.roles.reduce(
          (acc, role) => {
            acc[role.rol.toLowerCase()] = true;
            return acc;
          },
          {
            administrador: false,
            docente: false,
          }
        );
        setFormData({
          id: data.id,
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
          // si data.docente existe, se añade la experiencia
          experiencia: data.docente
            ? data.docente.tiempoExperiencia
              ? data.docente.tiempoExperiencia
              : 0
            : 0,
        });

        console.log("Docente: ", data.docente);
        console.log("Experiencias: ", data.docente.experiencias);
        setRoles(roles);

        setSelectedImage(data.foto);

        const selectedCampus = campuses.find(
          (campus) => campus.id === data.idCampusPertenece
        );
        setSelectedCampus(selectedCampus);

        const selectedProvincia = provincias.find(
          (provincia) => provincia.id === data.parroquia.CANTON.PROVINCIA.id
        );
        setSelectedProvincia(selectedProvincia);

        if (selectedProvincia) {
          const cantonesResponse = await fetch(
            `/api/canton/${selectedProvincia.id}`
          );
          const cantonesData = await cantonesResponse.json();
          setCantones(cantonesData);

          const selectedCanton = cantonesData.find(
            (canton) => canton.id === data.parroquia.idCantonPertenece
          );
          setSelectedCanton(selectedCanton);

          if (selectedCanton) {
            const parroquiasResponse = await fetch(
              `/api/parroquia/${selectedCanton.id}`
            );
            const parroquiasData = await parroquiasResponse.json();
            setParroquias(parroquiasData);

            const selectedParroquia = parroquiasData.find(
              (parroquia) => parroquia.id === data.idParroquiaPertenece
            );
            setSelectedParroquia(selectedParroquia);
          }

          if (data.docente) {
            if (data.docente.titulos) {
              setTitulos(data.docente.titulos);
            }
            if (data.docente.experiencias) {
              setExperiencias(data.docente.experiencias);
              /* setFormData({
                experiencia: data.docente.tiempoExperiencia,
              }); */
            }
          } else {
            setTitulos([]);
            setExperiencias([]);
            /* setFormData({
              experiencia: 0,
            }); */
          }
        }
      } else {
        setFormData({
          id: "",
          nombre: "",
          apellido: "",
          correo: "",
          contrasena: "",
          nacionalidad: "",
          direccion: "",
          telefono: "",
          fechaNacimiento: "",
          genero: "",
          experiencia: 0,
        });
        setRoles({
          administrador: false,
          docente: true,
        });
        setTitulos([]);
        setExperiencias([]);
        setSelectedCampus(null);
        setSelectedProvincia(null);
        setSelectedCanton(null);
        setSelectedParroquia(null);
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error fetching data:");
      setFormData(null);
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        nacionalidad: "",
        direccion: "",
        telefono: "",
        fechaNacimiento: "",
        genero: "",
        experiencia: 0,
      });
      setRoles({
        administrador: false,
        docente: true,
      });
      setTitulos([]);
      setExperiencias([]);
      setSelectedCampus(null);
      setSelectedProvincia(null);
      setSelectedCanton(null);
      setSelectedParroquia(null);
      setSelectedImage(null);
    } finally {
      setIsLoading(false); // Establece el estado de carga
    }
  };

  // Efecto secundario para depurar los datos de formData
  useEffect(() => {
    console.log("FormData actualizado:", formData);
  }, [formData]);

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

  const handleInputChangeTitulo = (value) => {
    setAddTitulo(value);
  };

  const handleInputChangeExperiencia = (value) => {
    setAddExperiencia(value);
  };

  const handleInputChangeExperienciaCargo = (value) => {
    setAddExperienciaCargo(value);
  }

  return (
    <div className="bg-gray-100 w-full flex justify-center pt-24 pb-10">
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo semi-transparente
            zIndex: 9999,
          }}
        >
          <CircularProgress size={50} />
        </div>
      )}

      {notificacion && (
        <>
          <Alert
            icon={<CheckCircleIcon className="w-6 h-6" />}
            className="fixed bottom-4 left-4 z-50 rounded-none border-l-4 border-green-800 bg-green-50 font-medium text-green-800  w-auto"
          >
            {notificacion}
          </Alert>
          <Alert
            icon={<ExclamationCircleIcon className="w-6 h-6" />}
            className="fixed bottom-4 left-4 z-50 rounded-none border-l-4 border-red-800 bg-red-50 font-medium text-red-800 w-auto"
          >
            {notificacion}
          </Alert>
        </>
      )}
      <div className="w-full">
        <form className="px-10" onSubmit={handleSubmit}>
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <IdentificationIcon className="w-6 h-6" />
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
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                    <BuildingOffice2Icon className="h-6 w-6" />
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
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <AtSymbolIcon className="h-6 w-6" />
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <ShieldCheckIcon className="h-6 w-6" />
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-lg">
                  <UserCircleIcon className="h-6 w-6" />
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
                  <UserCircleIcon className="h-6 w-6" />
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <GlobeAmericasIcon className="h-6 w-6" />
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <CalendarDaysIcon className="h-6 w-6" />
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
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                    <MapIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">
                      {selectedProvincia
                        ? selectedProvincia.provincia
                        : "Seleccione una provincia"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {provincias.map((provincia) => (
                      <MenuItem
                        key={provincia.id}
                        onClick={() => handleSelectProvincia(provincia)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900 block px-4 py-2 text-sm text-gray-900">
                          {provincia.provincia}
                        </a>
                      </MenuItem>
                    ))}
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
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">
                      {selectedCanton
                        ? selectedCanton.canton
                        : "Seleccione un cantón"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {cantones.map((canton) => (
                      <MenuItem
                        key={canton.id}
                        onClick={() => handleSelectCanton(canton)}
                      >
                        <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                          {canton.canton}
                        </a>
                      </MenuItem>
                    ))}
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
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                    <HomeIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-gray-100 border border-blue-900">
                    <p className="p-2.5">
                      {selectedParroquia
                        ? selectedParroquia.parroquia
                        : "Seleccione una parroquia"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-gray-900"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white border border-blue-900 shadow-blue-900 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {parroquias.map((parroquia) => (
                      <MenuItem
                        key={parroquia.id}
                        onClick={() => handleSelectParroquia(parroquia)}
                      >
                        <a className="block px-4 py-2 text-sm text-gray-900 data-[focus]:bg-blue-gray-100 data-[focus]:text-gray-900">
                          {parroquia.parroquia}
                        </a>
                      </MenuItem>
                    ))}
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <MapPinIcon className="h-6 w-6" />
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
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <PhoneIcon className="h-6 w-6" />
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
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                    <UserGroupIcon className="h-6 w-6" />
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

            <div>
              <label
                htmlFor="experiencia"
                className="block mb-2 text-sm font-medium text-blue-900"
              >
                Años de Experiencia
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 border rounded-l-lg border-blue-900 border-e-0 rounded-s-m">
                  <ClockIcon className="h-6 w-6" />
                </span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  id="experiencia"
                  name="experiencia"
                  className="rounded-none rounded-e-lg bg-white border text-gray-900 focus:ring-blue-900 focus:border-blue-900 block flex-1 min-w-0 w-full text-sm border-blue-900 p-2.5"
                  placeholder="1"
                  value={formData.experiencia}
                  onChange={handleChange}
                />
              </div>
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

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black">
                Titulos Academicos
              </label>
            </div>

            <div className="flex flex-wrap gap-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              {titulos.map((titulo) => (
                <Chip
                  key={titulo.id}
                  onClose={() => handleCloseTitulo(titulo)}
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-blue-500 border-small border-white/50 shadow-blue-500/30",
                    content: "drop-shadow shadow-black text-white",
                    closeButton: "text-red-400",
                  }}
                >
                  {titulo.titulo}
                </Chip>
              ))}

              <div className="ml-3 inline-flex items-center  text-sm text-blue-900 cursor-pointer">
                <Chip
                  onClick={onOpenTitulo}
                  endContent={
                    <PlusCircleIcon className="h-5 w-5 transform hover:scale-105 transition-transform duration-300 text-white" />
                  }
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-blue-500 border-small border-white/50 shadow-blue-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}
                >
                  Añadir
                </Chip>
                <Modal
                  isOpen={isOpenTitulo}
                  onOpenChange={onOpenChangeTitulo}
                  placement="top-center"
                  classNames={{
                    base: "bg-white border border-blue-900",
                    closeButton: "text-red-400 bg-gray-200",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="text-blue-900">
                          Añadir Título
                        </ModalHeader>
                        <ModalBody>
                          <Autocomplete
                            allowsCustomValue
                            startContent={
                              <ClipboardDocumentListIcon className="text-blue-900 h-6 w-6" />
                            }
                            label="Título"
                            isRequired={true}
                            labelPlacement="inside"
                            placeholder="Buscar título"
                            defaultItems={searchTitulos}
                            disabledKeys={titulos.map(
                              (titulo) => titulo.titulo
                            )}
                            classNames={{
                              base: "bg-gray-100 border border-blue-900 rounded-lg focus:ring-blue-900 focus:border-blue-900",
                              input: "text-gray-900",
                              listboxWrapper: "",
                              listbox:
                                "bg-white border border-blue-900 rounded-lg",
                              option: "text-gray-900 hover:bg-blue-100",
                              clearButton: "text-red-400",
                              selectorButton: "text-blue-900",
                              popoverContent:
                                "bg-gray-100 border border-blue-900",
                            }}
                            onInputChange={handleInputChangeTitulo}
                          >
                            {(titulo) => (
                              <AutocompleteItem key={titulo.titulo}>
                                {titulo.titulo}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Cerrar
                          </Button>
                          <Button
                            className="bg-blue-900 text-white hover:bg-blue-800"
                            onPress={() => {
                              handleAddTitulo();
                              onClose();
                            }}
                          >
                            Añadir
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" />

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black">
                Añadir historial de empleo
              </label>
            </div>

            <div className="flex flex-wrap gap-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              {experiencias.map((experiencia) => (
                <Popover
                  key={experiencia.experiencia.id}
                  placement="bottom"
                  showArrow={true}
                >
                  <PopoverTrigger>
                    <Chip
                      variant="shadow"
                      onClose={() => handleCloseExperiencia(experiencia)}
                      classNames={{
                        base: "bg-gradient-to-br from-indigo-500 to-blue-500 border-small border-white/50 shadow-blue-500/30 cursor-pointer",
                        content: "drop-shadow shadow-black text-white",
                        closeButton: "text-red-400",
                      }}
                    >
                      {experiencia.experiencia.institucion}
                    </Chip>
                    {/* <div className="capitalize bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full inline-flex items-center justify-center px-4 py-1 cursor-pointer text-white">
                      {experiencia.experiencia.institucion}
                    </div> */}
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">
                        {experiencia.experiencia.institucion}
                      </div>
                      <div className="text-tiny">{experiencia.cargo}</div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              <div className="ml-3 inline-flex items-center  text-sm text-blue-900 cursor-pointer">
                <Chip
                  onClick={onOpenExperiencia}
                  endContent={
                    <PlusCircleIcon className="h-5 w-5 transform hover:scale-105 transition-transform duration-300 text-white" />
                  }
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-blue-500 border-small border-white/50 shadow-blue-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}
                >
                  Añadir
                </Chip>
                <Modal
                  isOpen={isOpenExperiencia}
                  onOpenChange={onOpenChangeExperiencia}
                  placement="top-center"
                  classNames={{
                    base: "bg-white border border-blue-900",
                    closeButton: "text-red-400 bg-gray-200",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="text-blue-900">
                          Añadir Experiencia
                        </ModalHeader>
                        <ModalBody>
                          <Autocomplete
                            allowsCustomValue
                            label="Experiencia"
                            isRequired={true}
                            labelPlacement="inside"
                            placeholder="Buscar experiencia"
                            startContent={
                              <SparklesIcon className="h-6 w-6 text-blue-900" />
                            }
                            defaultItems={searchExperiencias}
                            disabledKeys={experiencias.map(
                              (experiencia) =>
                                experiencia.experiencia.institucion
                            )}
                            classNames={{
                              base: "bg-gray-100 border border-blue-900 rounded-lg focus:ring-blue-900 focus:border-blue-900",
                              input: "text-gray-900",
                              listboxWrapper: "",
                              listbox:
                                "bg-white border border-blue-900 rounded-lg",
                              option: "text-gray-900 hover:bg-blue-100",
                              clearButton: "text-red-400",
                              selectorButton: "text-blue-900",
                              popoverContent:
                                "bg-gray-100 border border-blue-900",
                            }}
                            onInputChange={handleInputChangeExperiencia}
                          >
                            {(experiencia) => (
                              <AutocompleteItem key={experiencia.institucion}>
                                {experiencia.institucion}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>

                          <Input
                            type="text"
                            label="Cargo"
                            labelPlacement="inside"
                            variant="bordered"
                            placeholder="Docente"
                            isInvalid={false}
                            errorMessage="Por favor, ingrese un cargo"
                            isRequired={true}
                            isClearable
                            startContent={
                              <BriefcaseIcon className="h-6 w-6 text-blue-900" />
                            }
                            onChange={handleInputChangeExperienciaCargo}
                            classNames={{
                              base: "",
                              input: "text-gray-900",
                              inputWrapper:
                                "bg-gray-100 border border-blue-900 focus:ring-blue-900 focus:border-blue-900",
                              clearButton: "text-red-400", // Es el icono de limpiar el input
                            }}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Cerrar
                          </Button>
                          <Button
                            color="primary"
                            className="bg-blue-900 text-white hover:bg-blue-800"
                            onPress={() => {
                              onClose();
                            }}
                          >
                            Añadir
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" />

            {/* botones: cancelar, dar de baja al usuario, guardar */}
            <button
              className="bg-blue-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              type="submit"
            >
              Guardar
            </button>
            <button className="bg-red-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Dar de Baja
            </button>
            <button className="bg-gray-900 text-white font-bold py-2.5 px-5 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Datos;
