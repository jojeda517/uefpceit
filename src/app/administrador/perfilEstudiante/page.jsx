"use client";
import React from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
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
  BookmarkSquareIcon,
  TrashIcon,
  CloudArrowUpIcon,
  HandRaisedIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  BriefcaseIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
} from "@heroicons/react/20/solid";
import {
  Chip,
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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CircularProgress from "@mui/material/CircularProgress";
import Notification from "@/app/components/Notification";
import { useState, useEffect } from "react";
import { color } from "framer-motion";

function PerfilEstudiante() {
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
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
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
          setNotificacion({ message: "El título ya existe", type: "warning" });
        } else {
          const newTitulo = {
            id: result.titulo.id,
            titulo: result.titulo.titulo,
          };
          setTitulos([...titulos, newTitulo]);
          setNotificacion({
            message: "Título añadido correctamente",
            type: "success",
          });
        }
      } else {
        setNotificacion({
          message: "El campo de título está vacío",
          type: "warning",
        });
      }
    } catch (error) {
      setNotificacion({ message: "Error al añadir título", type: "error" });
    } finally {
      setAddTitulo("");
      setIsLoading(false);
    }
  };

  const handleAddExperiencia = async () => {
    try {
      setIsLoading(true);
      if (addExperiencia) {
        const response = await fetch("/api/experiencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ institucion: addExperiencia }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (
          experiencias.find(
            (experiencia) =>
              experiencia.experiencia.id === result.institucion.id
          )
        ) {
          setNotificacion({
            message: "La experiencia ya existe",
            type: "warning",
          });
        } else {
          const newInstitucion = {
            experiencia: {
              id: result.institucion.id,
              institucion: result.institucion.institucion,
            },
            cargo: addExperienciaCargo,
          };
          setExperiencias([...experiencias, newInstitucion]);
          setNotificacion({
            message: "Experiencia añadida correctamente",
            type: "success",
          });
        }
      } else {
        setNotificacion({
          message: "El campo de experiencia está vacío",
          type: "warning",
        });
      }
    } catch (error) {
      setNotificacion({
        message: "Error al añadir la institucion",
        type: "error",
      });
    } finally {
      setAddExperiencia("");
      setAddExperienciaCargo("");
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
      // Validar que Campus, Provincia, Cantón, Parroquia y Género estén seleccionados
      if (
        !selectedCampus ||
        !selectedProvincia ||
        !selectedCanton ||
        !selectedParroquia ||
        !formData.genero
      ) {
        setNotificacion({
          message: "Por favor, complete todos los campos obligatorios",
          type: "warning",
        });
      } else {
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
        const fecha = new Date(formData.fechaNacimiento);
        formPOST.append("fechaNacimiento", fecha.toISOString());
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

        // Agregar Experiencias
        if (experiencias.length > 0) {
          formPOST.append("experiencias", JSON.stringify(experiencias));
        }

        // Agregar el nombre de los roles con valor true [{rol: administrador}, {rol: docente}]
        const rolesArray = Object.entries(roles)
          .filter(([, value]) => value)
          .map(([key]) => ({
            rol: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
          }));
        formPOST.append("roles", JSON.stringify(rolesArray));

        const response = await fetch("/api/persona/docente", {
          method: "POST",
          body: formPOST,
        });

        console.log("response", response);

        if (response.ok) {
          const result = await response.json();
          setNotificacion({
            message: "Datos actualizados correctamente",
            type: "success",
          });
        } else {
          const error = await response.json();
          setNotificacion({
            message: "Error. Verifique los datos e inténtelo nuevamente",
            type: "error",
          });
        }
      }
    } catch (error) {
      setNotificacion({
        message: "Error. Verifique los datos e inténtelo nuevamente",
        type: "error",
      });
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

  // Manejar limpieza de datos
  const handleClear = async (event) => {
    setIsLoading(true); // Establece el estado de carga a true
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
    }); // Limpiar los datos del formulario
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
    setCedula("");
    setIsLoading(false);
    setNotificacion({
      message: "Formulario limpiado correctamente",
      type: "success",
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
            }
          } else {
            setTitulos([]);
            setExperiencias([]);
          }
        }
        setNotificacion({
          message: "Datos cargados correctamente",
          type: "success",
        });
      } else {
        handleClear();
        setNotificacion({
          message: "No se encontraron datos para la cédula ingresada",
          type: "warning",
        });
      }
    } catch (error) {
      handleClear();
      setNotificacion({
        message: "No se encontraron datos para la cédula ingresada",
        type: "warning",
      });
    } finally {
      setIsLoading(false); // Establece el estado de carga
    }
  };

  // Efecto secundario para depurar los datos de formData
  useEffect(() => {
    console.log("FormData actualizado:", formData);
    console.log("Expereincias actualizadas:", experiencias);
    console.log("Titulos actualizados:", titulos);
    console.log("Roles actualizados:", roles);
  }, [formData, experiencias, titulos, roles]);

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
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 w-full flex justify-center pt-24 pb-10">
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

      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />

      <div className="w-full">
        <form className="px-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2 pb-5">
            <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
              Perfil de Estudiante
            </h2>
            <p className="font-light text-lg text-black dark:text-white">
              Información personal
            </p>
          </div>
          <div className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            <div className="grid row-span-3 justify-items-center content-center">
              <div
                htmlFor="foto"
                className="flex flex-col items-center justify-center w-52 h-52 border-2 border-blue-900 dark:border-black border-dashed rounded-full cursor-pointer bg-gray-50 dark:bg-gray-600 hover:bg-blue-gray-50 dark:hover:bg-gray-500"
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
                    {/* <svg
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
                    </svg> */}
                    <CloudArrowUpIcon className="h-14 w-14 text-gray-800" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                      <span className="font-semibold">Haga clic</span> o
                      arrastre y suelte
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
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
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Número de cédula
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <IdentificationIcon className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  pattern="\d{10}"
                  id="cedula"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="9999999999"
                  onChange={(e) => setCedula(e.target.value)}
                  required
                />
                <div
                  /* enviar el valor de cedula en el oncklick */
                  onClick={handleCedulaChange}
                  className="ml-2 px-3 text-sm bg-blue-900 dark:bg-gray-900 hover:bg-blue-gray-100 dark:hover:bg-gray-900 hover:text-blue-900 dark:hover:text-blue-500 text-white border border-blue-900 dark:border-black dark:hover:shadow-black dark:hover:shadow-md rounded-lg cursor-pointer flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Campus
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <BuildingOffice2Icon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
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
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {campuses.map((campus) => (
                      <MenuItem
                        key={campus.id}
                        onClick={() => handleSelectCampus(campus)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
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
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Correo
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <AtSymbolIcon className="h-6 w-6" />
                </span>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="ejemplo@gmail.com"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Contraseña
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <ShieldCheckIcon className="h-6 w-6" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  className="rounded-none bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="********"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
                <div
                  onClick={togglePasswordVisibility}
                  className=" px-3 text-sm bg-blue-900 dark:bg-gray-900 hover:bg-blue-gray-100 dark:hover:bg-gray-900 dark:hover:shadow-black dark:hover:shadow-md hover:text-blue-900 dark:hover:text-blue-500 text-white border border-blue-900 dark:border-black rounded-e-lg cursor-pointer flex items-center justify-center"
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
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Nombres
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <UserCircleIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Juan Antonio"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Apellidos
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <UserCircleIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Pérez López"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nacionalidad"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Nacionalidad
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <GlobeAmericasIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="nacionalidad"
                  name="nacionalidad"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Ecuatoriana"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lugarNacimiento"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Lugar de Nacimiento
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <GlobeAmericasIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="lugarNacimiento"
                  name="lugarNacimiento"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Ambato"
                  value={formData.lugarNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="fechaNacimiento"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Fecha de Nacimiento
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <CalendarDaysIcon className="h-6 w-6" />
                </span>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="dd/mm/aaaa"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Auto identificación etnica
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <HandRaisedIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {selectedProvincia
                        ? selectedProvincia.provincia
                        : "Seleccione una provincia"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {provincias.map((provincia) => (
                      <MenuItem
                        key={provincia.id}
                        onClick={() => handleSelectProvincia(provincia)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {provincia.provincia}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Provincia
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <MapIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {selectedProvincia
                        ? selectedProvincia.provincia
                        : "Seleccione una provincia"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {provincias.map((provincia) => (
                      <MenuItem
                        key={provincia.id}
                        onClick={() => handleSelectProvincia(provincia)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {provincia.provincia}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Cantón
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {selectedCanton
                        ? selectedCanton.canton
                        : "Seleccione un cantón"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {cantones.map((canton) => (
                      <MenuItem
                        key={canton.id}
                        onClick={() => handleSelectCanton(canton)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {canton.canton}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Parroquia
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <HomeIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {selectedParroquia
                        ? selectedParroquia.parroquia
                        : "Seleccione una parroquia"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {parroquias.map((parroquia) => (
                      <MenuItem
                        key={parroquia.id}
                        onClick={() => handleSelectParroquia(parroquia)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
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
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Dirección
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <MapPinIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Calle S/N"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Teléfono
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <PhoneIcon className="h-6 w-6" />
                </span>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  pattern="\d{10}"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="0999999999"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Género
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <UserGroupIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {formData.genero || "Seleccione un género"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {["Masculino", "Femenino", "Otro"].map((option) => (
                      <MenuItem key={option}>
                        <a
                          onClick={() =>
                            setFormData({ ...formData, genero: option })
                          }
                          className={`data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black block px-4 py-2 text-sm text-gray-900 dark:text-white ${
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

            <div className="">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Estado Civil
              </label>
              <Menu
                as="div"
                className="relative inline-block text-left min-w-full"
              >
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <HeartIcon className="h-6 w-6" />
                  </span>
                  <MenuButton className="flex-grow inline-flex items-center justify-between rounded-r-lg bg-white dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-800 hover:bg-blue-gray-100 dark:hover:bg-gray-700 border border-blue-900 dark:border-black">
                    <p className="p-2.5">
                      {formData.genero || "Seleccione un estado civil"}
                    </p>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="mx-1.5 h-5 w-5 text-black"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-600 border border-blue-900 dark:border-black shadow-blue-900 dark:shadow-black shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in max-h-52 overflow-y-auto"
                >
                  <div className="py-1 cursor-pointer">
                    {["Casado", "Divorciado", "Soltero", "Unión de Hecho", "Viudo"].map((option) => (
                      <MenuItem key={option}>
                        <a
                          onClick={() =>
                            setFormData({ ...formData, estadoCivil: option })
                          }
                          className={`data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black block px-4 py-2 text-sm text-gray-900 dark:text-white ${
                            formData.estadoCivil === option ? "bg-blue-100" : ""
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
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Roles
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="administrador"
                  name="administrador"
                  checked={roles.administrador}
                  onChange={handleRoleChange}
                  className="w-4 h-4 text-blue-900 border-gray-300 dark:border-black rounded focus:ring-blue-900 dark:focus:ring-black"
                />
                <label
                  htmlFor="administrador"
                  className="ml-2 text-sm font-medium text-black dark:text-white"
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
                  className="w-4 h-4 text-blue-900 border-gray-300 dark:border-black rounded focus:ring-blue-900 dark:focus:ring-black"
                />
                <label
                  htmlFor="docente"
                  className="ml-2 text-sm font-medium text-black dark:text-white"
                >
                  Docente
                </label>
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900 dark:border-black" />

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black dark:text-white">
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
                    base: "bg-gradient-to-br from-indigo-500 dark:from-gray-200 to-blue-500 dark:to-gray-800 border-small border-white/50 shadow-blue-500/30 dark:shadow-gray-900/30",
                    content:
                      "drop-shadow shadow-black text-white dark:text-black",
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
                    <PlusCircleIcon className="h-5 w-5 transform hover:scale-105 transition-transform duration-300 text-white dark:text-green-400" />
                  }
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 dark:from-gray-200 to-blue-500 dark:to-gray-800 border-small border-white/50 shadow-blue-500/30 dark:shadow-gray-900/30",
                    content:
                      "drop-shadow shadow-black text-white dark:text-black",
                  }}
                >
                  Añadir
                </Chip>
                <Modal
                  isOpen={isOpenTitulo}
                  onOpenChange={onOpenChangeTitulo}
                  placement="top-center"
                  classNames={{
                    base: "bg-white dark:bg-gray-800 border border-blue-900 dark:border-black",
                    closeButton:
                      "text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="text-blue-900 dark:text-white">
                          Añadir Título
                        </ModalHeader>
                        <ModalBody>
                          <Autocomplete
                            allowsCustomValue
                            startContent={
                              <ClipboardDocumentListIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                            }
                            label={
                              <label className="text-blue-900 dark:text-white">
                                Título
                              </label>
                            }
                            isRequired={true}
                            labelPlacement="inside"
                            placeholder="Buscar título"
                            defaultItems={searchTitulos}
                            disabledKeys={titulos.map(
                              (titulo) => titulo.titulo
                            )}
                            variant="bordered"
                            inputProps={{
                              className: "dark:text-white",
                            }}
                            classNames={{
                              base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",

                              listboxWrapper: "", // Es el contenedor del listbox
                              listbox:
                                "bg-white border border-blue-900 dark:border-black text-red-500 ",
                              option: "text-gray-900 hover:bg-blue-100", // Opciones del listbox
                              clearButton: "text-red-400",
                              selectorButton: "text-blue-900 dark:text-black",
                              popoverContent:
                                "bg-gray-100 dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
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
                            className="bg-gradient-to-tr from-blue-900 to-red-500 text-white shadow-red-500 shadow-lg"
                            onPress={onClose}
                          >
                            Cerrar
                          </Button>
                          <Button
                            className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
                            onPress={() => {
                              if (addTitulo) {
                                handleAddTitulo(addTitulo);
                                onClose();
                              } else {
                                setNotificacion({
                                  message: "Por favor, ingrese un título",
                                  type: "warning",
                                });
                              }
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

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900 dark:border-black" />

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black dark:text-white">
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
                        base: "bg-gradient-to-br from-indigo-500 dark:from-gray-200 to-blue-500 dark:to-gray-800 border-small border-white/50 shadow-blue-500/30 dark:shadow-gray-900/30 cursor-pointer",
                        content:
                          "drop-shadow shadow-black text-white dark:text-black",
                        closeButton: "text-red-400",
                      }}
                    >
                      {experiencia.experiencia.institucion}
                    </Chip>
                  </PopoverTrigger>
                  <PopoverContent className="dark:bg-gray-700">
                    <div className="px-1 py-2">
                      <div className="text-small font-bold dark:text-white">
                        {experiencia.experiencia.institucion}
                      </div>
                      <div className="text-tiny dark:text-white">
                        {experiencia.cargo}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              <div className="ml-3 inline-flex items-center  text-sm text-blue-900 cursor-pointer">
                <Chip
                  onClick={onOpenExperiencia}
                  endContent={
                    <PlusCircleIcon className="h-5 w-5 transform hover:scale-105 transition-transform duration-300 text-white dark:text-green-400" />
                  }
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 dark:from-gray-200 to-blue-500 dark:to-gray-800 border-small border-white/50 shadow-blue-500/30 dark:shadow-gray-900/30",
                    content:
                      "drop-shadow shadow-black text-white dark:text-black",
                  }}
                >
                  Añadir
                </Chip>
                <Modal
                  isOpen={isOpenExperiencia}
                  onOpenChange={onOpenChangeExperiencia}
                  placement="top-center"
                  classNames={{
                    base: "bg-white dark:bg-gray-800 border border-blue-900 dark:border-black",
                    closeButton:
                      "text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="text-blue-900 dark:text-white">
                          Añadir Experiencia
                        </ModalHeader>
                        <ModalBody>
                          <Autocomplete
                            allowsCustomValue
                            label={
                              <label className="text-blue-900 dark:text-white">
                                Experiencia
                              </label>
                            }
                            isRequired={true}
                            labelPlacement="inside"
                            placeholder="Buscar experiencia"
                            startContent={
                              <SparklesIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                            }
                            defaultItems={searchExperiencias}
                            disabledKeys={experiencias.map(
                              (experiencia) =>
                                experiencia.experiencia.institucion
                            )}
                            variant="bordered"
                            inputProps={{
                              className: "dark:text-white",
                            }}
                            classNames={{
                              base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",

                              listboxWrapper: "", // Es el contenedor del listbox
                              listbox:
                                "bg-white border border-blue-900 dark:border-black text-red-500 ",
                              option: "text-gray-900 hover:bg-blue-100", // Opciones del listbox
                              clearButton: "text-red-400",
                              selectorButton: "text-blue-900 dark:text-black",
                              popoverContent:
                                "bg-gray-100 dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
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
                            label={
                              <label className="text-blue-900 dark:text-white">
                                Cargo
                              </label>
                            }
                            labelPlacement="inside"
                            variant="bordered"
                            placeholder="Docente"
                            isInvalid={false}
                            errorMessage="Por favor, ingrese un cargo"
                            isRequired={true}
                            isClearable
                            startContent={
                              <BriefcaseIcon className="h-6 w-6 text-blue-900 dark:text-white" />
                            }
                            value={addExperienciaCargo}
                            onValueChange={handleInputChangeExperienciaCargo}
                            classNames={{
                              base: "",
                              input: "text-gray-900 dark:text-white",
                              inputWrapper:
                                "bg-gray-100 dark:bg-gray-800 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                              clearButton: "text-red-400", // Es el icono de limpiar el input
                            }}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            className="bg-gradient-to-tr from-blue-900 to-red-500 text-white shadow-red-500 shadow-lg"
                            onPress={onClose}
                          >
                            Cerrar
                          </Button>
                          <Button
                            className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
                            onPress={() => {
                              // Controlar que no se pueda añadir una experiencia sin cargo y sin experiencia
                              if (addExperienciaCargo && addExperiencia) {
                                handleAddExperiencia();
                                onClose();
                              } else {
                                setNotificacion({
                                  message:
                                    "Por favor, ingrese una experiencia y un cargo",
                                  type: "warning",
                                });
                              }
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

            {/* <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900" /> */}

            {/* botones: cancelar, dar de baja al usuario, guardar */}
            <div className="flex flex-wrap gap-4 justify-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <Button
                startContent={<BookmarkSquareIcon className="h-6 w-6" />}
                type="submit"
                className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
              >
                Guardar
              </Button>
              <Button
                startContent={<TrashIcon className="h-6 w-6" />}
                type="button"
                onClick={handleClear}
                className="bg-gradient-to-tr from-blue-900 to-red-500 text-white shadow-red-500 shadow-lg"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerfilEstudiante;
