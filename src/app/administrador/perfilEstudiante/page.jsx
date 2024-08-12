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
  BookmarkSquareIcon,
  TrashIcon,
  CloudArrowUpIcon,
  HandRaisedIcon,
  HeartIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
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
  Checkbox,
  Slider,
  Tooltip,
} from "@nextui-org/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import CircularProgress from "@mui/material/CircularProgress";
import Notification from "@/app/components/Notification";
import { HandThumbUpIcon } from "@/app/components/HandThumbUpIcon.jsx";
import { HeartSolidIcon } from "@/app/components/HeartIcon.jsx";
import { useState, useEffect } from "react";

function PerfilEstudiante() {
  const [showPassword, setShowPassword] = useState(false);
  const [cedula, setCedula] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [etnias, setEtnias] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [searchDiscapacidades, setSearchDiscapacidades] = useState([]); // Poblar Autocomplete
  const [discapacidades, setDiscapacidades] = useState([]); // Discapacidades del estudiante
  const [addDiscapacidad, setAddDiscapacidad] = useState({ id: "", tipo: "" }); // Discapacidad a añadir
  const [addPorcentajeDiscapacidad, setAddPorcentajeDiscapacidad] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedEtnia, setSelectedEtnia] = useState(null);
  const [selectedEstadoCivil, setSelectedEstadoCivil] = useState(null);
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedCanton, setSelectedCanton] = useState(null);
  const [selectedParroquia, setSelectedParroquia] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [bonoMies, setBonoMies] = useState(false);
  const [trabaja, setTrabaja] = useState(false);
  const [hijos, setHijos] = useState(false);
  const [discapacidad, setDiscapacidad] = useState(false);
  const [rangoEdadHijo, setRangoEdadHijo] = useState([5, 15]);
  const {
    isOpen: isOpenDiscapacidad,
    onOpen: onOpenDiscapacidad,
    onOpenChange: onOpenChangeDiscapacidad,
  } = useDisclosure();
  const [formData, setFormData] = useState({
    id: "",
    correo: "",
    contrasena: "",
    nombre: "",
    apellido: "",
    nacionalidad: "",
    lugarNacimiento: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    genero: "",
    codigoElectricoUnico: "",
    numeroCarnetDiscapacidad: "",
    observacion: "",
    nombreTrabajo: "",
    cedulaRepresentante: "",
    nombreRepresentante: "",
    apellidoRepresentante: "",
    direccionRepresentante: "",
    telefonoRepresentante: "",
    ocupacionRepresentante: "",
  });

  const handleAddDiscapacidad = async () => {
    try {
      setIsLoading(true);
      if (addDiscapacidad) {
        const newDiscapacidad = {
          Discapacidad: {
            id: addDiscapacidad.id,
            tipo: addDiscapacidad.tipo,
          },
          porcentaje: addPorcentajeDiscapacidad,
        };
        setDiscapacidades([...discapacidades, newDiscapacidad]);
        setNotificacion({
          message: "Discapacidad añadida correctamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message: "El campo de discapacidad está vacío",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error al añadir discapacidad:", error);
      setNotificacion({
        message: "Ocurrió un error al añadir la discapacidad",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setAddDiscapacidad({ id: "", tipo: "" });
      setAddPorcentajeDiscapacidad(1);
    }
  };

  const handleCloseDiscapacidad = (discapacidadToRemove) => {
    setDiscapacidades(
      discapacidades.filter(
        (discapacidad) => discapacidad !== discapacidadToRemove
      )
    );
  };

  const handleRangoEdadHijos = (newValue) => {
    setRangoEdadHijo(newValue);
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
        !formData.genero ||
        !selectedEtnia
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
        }
        formPOST.append("idCampusPertenece", selectedCampus.id);
        formPOST.append("idParroquiaPertenece", selectedParroquia.id);
        formPOST.append("nombre", formData.nombre);
        formPOST.append("apellido", formData.apellido);
        formPOST.append("cedula", cedula);
        formPOST.append("direccion", formData.direccion);
        const fecha = new Date(formData.fechaNacimiento);
        formPOST.append("fechaNacimiento", fecha.toISOString());
        formPOST.append("nacionalidad", formData.nacionalidad);
        formPOST.append("telefono", formData.telefono);
        formPOST.append("sexo", formData.genero);
        formPOST.append("correo", formData.correo);
        formPOST.append("contrasena", formData.contrasena);
        formPOST.append("cedulaRepresentante", formData.cedulaRepresentante);
        formPOST.append("nombresRepresentante", formData.nombreRepresentante);
        formPOST.append(
          "apellidosRepresentante",
          formData.apellidoRepresentante
        );
        formPOST.append(
          "direccionRepresentante",
          formData.direccionRepresentante
        );
        formPOST.append(
          "telefonoRepresentante",
          formData.telefonoRepresentante
        );
        formPOST.append(
          "ocupacionRepresentante",
          formData.ocupacionRepresentante
        );
        formPOST.append("idEstadoCivilPertenece", selectedEstadoCivil.id);
        formPOST.append("idEtniaPertenece", selectedEtnia.id);
        formPOST.append("trabaja", trabaja);
        if (trabaja) {
          formPOST.append("nombreTrabajo", formData.nombreTrabajo);
        } else {
          formPOST.append("nombreTrabajo", "");
        }
        formPOST.append("tieneHijo", hijos);
        if (hijos) {
          formPOST.append("rangoEdadHijo", JSON.stringify(rangoEdadHijo)); // Convertir el array a un string JSON
        } else {
          formPOST.append("rangoEdadHijo", JSON.stringify([0, 0])); // Valor por defecto
        }
        formPOST.append("bonoMies", bonoMies);
        if (discapacidad) {
          formPOST.append(
            "numeroCarnetDiscapacidad",
            formData.numeroCarnetDiscapacidad
          );
        } else {
          formPOST.append("numeroCarnetDiscapacidad", "");
        }
        formPOST.append("lugarNacimiento", formData.lugarNacimiento);
        formPOST.append("codigoElectricoUnico", formData.codigoElectricoUnico);
        formPOST.append("observacion", formData.observacion);

        // Agregar foto
        if (selectedImage) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formPOST.append("foto", blob);
        }

        /* // Agregar Experiencias
        if (experiencias.length > 0) {
          formPOST.append("experiencias", JSON.stringify(experiencias));
        } */

        const response = await fetch("/api/persona/estudiante", {
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
    const fetchDiscapacidades = async () => {
      try {
        const response = await fetch("/api/discapacidad");
        const data = await response.json();
        setSearchDiscapacidades(data);
      } catch (error) {
        console.error("Error fetching discapacidades:", error);
      }
    };
    fetchDiscapacidades();
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
    const fetchEtnias = async () => {
      try {
        const response = await fetch("/api/etnia");
        const data = await response.json();
        setEtnias(data);
      } catch (error) {
        console.error("Error fetching etnias:", error);
      }
    };

    fetchEtnias();
  }, []);

  const handleSelectEtnia = (etnia) => {
    setSelectedEtnia(etnia);
  };

  useEffect(() => {
    const fetchEstadosCiviles = async () => {
      try {
        const response = await fetch("/api/estadoCivil");
        const data = await response.json();
        setEstadosCiviles(data);
      } catch (error) {
        console.error("Error fetching estados civiles:", error);
      }
    };
    fetchEstadosCiviles();
  }, []);

  const handleSelectEstadoCivil = (estadoCivil) => {
    setSelectedEstadoCivil(estadoCivil);
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
      const response = await fetch(`/api/persona/estudiante/${cedula}`);
      const data = await response.json();

      if (data) {
        setFormData({
          id: data.id,
          correo: data.usuario.correo,
          contrasena: data.usuario.contrasena,
          nombre: data.nombre,
          apellido: data.apellido,
          nacionalidad: data.nacionalidad,
          lugarNacimiento: data.estudiante
            ? data.estudiante.lugarNacimiento
            : "",
          fechaNacimiento: new Date(data.fechaNacimiento)
            .toISOString()
            .split("T")[0],
          direccion: data.direccion,
          telefono: data.telefono,
          genero: data.sexo,
          codigoElectricoUnico: data.estudiante
            ? data.estudiante.codigoElectricoUnico
            : "",
          numeroCarnetDiscapacidad: data.estudiante
            ? data.estudiante.numeroCarnetDiscapacidad
            : "",
          observacion: data.estudiante
            ? data.estudiante.observacion
              ? data.estudiante.observacion
              : ""
            : "",
          nombreTrabajo: data.estudiante
            ? data.estudiante.nombreTrabajo
              ? data.estudiante.nombreTrabajo
              : ""
            : "",
          /* Datos del representante */
          cedulaRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.cedula
              ? data.estudiante.REPRESENTANTE.cedula
              : ""
            : "",
          nombreRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.nombre
              ? data.estudiante.REPRESENTANTE.nombre
              : ""
            : "",
          apellidoRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.apellido
              ? data.estudiante.REPRESENTANTE.apellido
              : ""
            : "",
          direccionRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.direccion
              ? data.estudiante.REPRESENTANTE.direccion
              : ""
            : "",
          telefonoRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.telefono
              ? data.estudiante.REPRESENTANTE.telefono
              : ""
            : "",
          ocupacionRepresentante: data.estudiante.REPRESENTANTE
            ? data.estudiante.REPRESENTANTE.ocupacion
              ? data.estudiante.REPRESENTANTE.ocupacion
              : ""
            : "",
        });

        if (data.estudiante) {
          if (data.estudiante.rangoEdadHijo) {
            // Convertir el string JSON a un array
            const parsedValue = JSON.parse(data.estudiante.rangoEdadHijo);
            // Asegurarse de que el valor sea un array con dos números
            if (Array.isArray(parsedValue) && parsedValue.length === 2) {
              setRangoEdadHijo(parsedValue);
            }
          } else {
            setRangoEdadHijo([5, 15]);
          }
        } else {
          setRangoEdadHijo([5, 15]);
        }

        setBonoMies(
          data.estudiante
            ? data.estudiante.bonoMies
              ? data.estudiante.bonoMies
              : false
            : false
        );

        setTrabaja(
          data.estudiante
            ? data.estudiante.trabaja
              ? data.estudiante.trabaja
              : false
            : false
        );

        setHijos(
          data.estudiante
            ? data.estudiante.tieneHijo
              ? data.estudiante.tieneHijo
              : false
            : false
        );

        setSelectedImage(data.foto);

        const selectedCampus = campuses.find(
          (campus) => campus.id === data.idCampusPertenece
        );
        setSelectedCampus(selectedCampus);

        const selectedEtnia = etnias.find(
          (etnia) => etnia.id === data.estudiante.idEtniaPertenece
        );
        setSelectedEtnia(selectedEtnia);

        const selectedEstadoCivil = estadosCiviles.find(
          (estado) => estado.id === data.estudiante.idEstadoCivilPertenece
        );
        setSelectedEstadoCivil(selectedEstadoCivil);

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

          if (data.estudiante) {
            if (data.estudiante.DETALLE_DISCAPACIDAD) {
              setDiscapacidad(true);
              setDiscapacidades(data.estudiante.DETALLE_DISCAPACIDAD);
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
    console.log("discapacidades:", discapacidades);
    console.log("addDiscapacidad:", addDiscapacidad);
  }, [formData, discapacidades, addDiscapacidad]);

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

  const handleInputChangeDiscapacidad = (item) => {
    const selectedItem = searchDiscapacidades.find(
      (discapacidad) => discapacidad.id === parseInt(item)
    );
    if (selectedItem) {
      setAddDiscapacidad({
        id: selectedItem.id,
        tipo: selectedItem.tipo,
      });
    }
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
                      {selectedEtnia
                        ? selectedEtnia.etnia
                        : "Seleccione una etnia"}
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
                    {etnias.map((etnia) => (
                      <MenuItem
                        key={etnia.id}
                        onClick={() => handleSelectEtnia(etnia)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {etnia.etnia}
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
                            formData.genero === option
                              ? "bg-blue-100 dark:bg-gray-500 dark:text-black"
                              : ""
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
                      {selectedEstadoCivil
                        ? selectedEstadoCivil.estadoCivil
                        : "Seleccione una etnia"}
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
                    {estadosCiviles.map((estadoCivil) => (
                      <MenuItem
                        key={estadoCivil.id}
                        onClick={() => handleSelectEstadoCivil(estadoCivil)}
                      >
                        <a className="data-[focus]:bg-blue-gray-100 dark:data-[focus]:bg-gray-400 data-[focus]:text-black  block px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {estadoCivil.estadoCivil}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            </div>

            <div>
              <label
                htmlFor="codigoElectricoUnico"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Código Eléctrico
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <BoltIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="codigoElectricoUnico"
                  name="codigoElectricoUnico"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="200010000000"
                  pattern="\d+" // Solo números
                  value={formData.codigoElectricoUnico}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 justify-center">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Bono del MIES
              </label>
              <Checkbox
                isSelected={bonoMies}
                disableAnimation
                icon={<HandThumbUpIcon />}
                size="lg"
                onValueChange={setBonoMies}
              >
                <p className="dark:text-white">
                  ¿Recibe bono del MIES? - {bonoMies ? "Sí" : "No"}
                </p>
              </Checkbox>
            </div>

            <div className="grid grid-cols-1 justify-center">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Trabajo
              </label>
              <Checkbox
                isSelected={trabaja}
                disableAnimation
                icon={<HandThumbUpIcon />}
                size="lg"
                onValueChange={setTrabaja}
              >
                <p className="dark:text-white">
                  ¿Trabaja? - {trabaja ? "Sí" : "No"}
                </p>
              </Checkbox>
            </div>

            {/* si trabaja mostrar un mensaje */}
            {trabaja && (
              <div>
                <label
                  htmlFor="nombreTrabajo"
                  className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
                >
                  En que trabaja
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <WrenchScrewdriverIcon className="h-6 w-6" />
                  </span>
                  <input
                    type="text"
                    id="nombreTrabajo"
                    name="nombreTrabajo"
                    className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                    placeholder="Nombre del trabajo"
                    value={formData.nombreTrabajo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 justify-center">
              <label className="block mb-2 text-sm font-medium text-blue-900 dark:text-white">
                Hijos
              </label>
              <Checkbox
                isSelected={hijos}
                disableAnimation
                icon={<HandThumbUpIcon />}
                size="lg"
                onValueChange={setHijos}
              >
                <p className="dark:text-white">
                  ¿Tiene hijos? - {hijos ? "Sí" : "No"}
                </p>
              </Checkbox>
            </div>

            {/* si trabaja mostrar un mensaje */}
            {hijos && (
              <div>
                <div>
                  <Slider
                    size="lg"
                    label={
                      <label className="text-blue-900 dark:text-white">
                        Rango de edad de los hijos
                      </label>
                    }
                    maxValue={100}
                    value={rangoEdadHijo}
                    onChange={handleRangoEdadHijos}
                    step={1}
                    defaultValue={[5, 15]}
                    classNames={{
                      base: "max-w-md gap-3",
                      value: "dark:text-white text-blue-900",
                      filler:
                        "bg-gradient-to-r from-pink-300 to-cyan-300 dark:from-pink-600 dark:to-cyan-800",
                    }}
                    renderLabel={({ children, ...props }) => (
                      <label
                        {...props}
                        className="text-medium flex gap-2 items-center"
                      >
                        {children}
                        <Tooltip
                          className="w-[200px] px-1 text-tiny text-default-600 rounded-small"
                          content="Rango de edad de los hijos"
                          placement="right"
                        >
                          <span className="transition-opacity opacity-80 hover:opacity-100">
                            <InformationCircleIcon className="h-4 w-4" />
                          </span>
                        </Tooltip>
                      </label>
                    )}
                    renderThumb={({ index, ...props }) => (
                      <div
                        {...props}
                        className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                      >
                        <span
                          className={`transition-transform bg-gradient-to-br shadow-small rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80 ${
                            index === 0
                              ? "from-pink-200 to-pink-500 dark:from-pink-400 dark:to-pink-600" // first thumb
                              : "from-cyan-200 to-cyan-600 dark:from-cyan-600 dark:to-cyan-800" // second thumb
                          }`}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            )}

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900 dark:border-black" />

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <label className="font-light text-lg text-black dark:text-white">
                Datos del Representante Legal
              </label>
            </div>

            <div className="">
              <label
                htmlFor="cedulaRepresentante"
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
                  id="cedulaRepresentante"
                  name="cedulaRepresentante"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="9999999999"
                  required
                  value={formData.cedulaRepresentante}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="nombreRepresentante"
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
                  id="nombreRepresentante"
                  name="nombreRepresentante"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Juan Antonio"
                  value={formData.nombreRepresentante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellidoRepresentante"
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
                  id="apellidoRepresentante"
                  name="apellidoRepresentante"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Pérez López"
                  value={formData.apellidoRepresentante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="direccionRepresentante"
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
                  id="direccionRepresentante"
                  name="direccionRepresentante"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Calle S/N"
                  value={formData.direccionRepresentante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="telefonoRepresentante"
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
                  id="telefonoRepresentante"
                  name="telefonoRepresentante"
                  pattern="\d{10}"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="0999999999"
                  value={formData.telefonoRepresentante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ocupacionRepresentante"
                className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
              >
                Ocupación
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                  <WrenchScrewdriverIcon className="h-6 w-6" />
                </span>
                <input
                  type="text"
                  id="ocupacionRepresentante"
                  name="ocupacionRepresentante"
                  className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                  placeholder="Ocupación"
                  value={formData.ocupacionRepresentante}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3 my-2 border-blue-900 dark:border-black" />

            <div className="flex content-center col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
              <Checkbox
                isSelected={discapacidad}
                icon={<HeartSolidIcon />}
                color="warning"
                size="lg"
                onValueChange={setDiscapacidad}
              >
                <p className="dark:text-white">
                  ¿El estudiante tiene alguna discapacidad? -{" "}
                  {discapacidad ? "Sí" : "No"}
                </p>
              </Checkbox>
            </div>

            {discapacidad && (
              <div className="">
                <label
                  htmlFor="numeroCarnetDiscapacidad"
                  className="block mb-2 text-sm font-medium text-blue-900 dark:text-white"
                >
                  Número de carnet
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-white bg-blue-900 dark:bg-gray-900 border rounded-l-lg border-blue-900 dark:border-black border-e-0 rounded-s-m">
                    <IdentificationIcon className="w-6 h-6" />
                  </span>
                  <input
                    type="text"
                    pattern="\d{10}"
                    id="numeroCarnetDiscapacidad"
                    name="numeroCarnetDiscapacidad"
                    className="rounded-none rounded-e-lg bg-white dark:bg-gray-800 border text-gray-900 dark:text-white focus:ring-blue-900 focus:border-blue-900 dark:focus:ring-black dark:focus:border-black block flex-1 min-w-0 w-full text-sm border-blue-900 dark:border-black p-2.5"
                    placeholder="9999999999"
                    required
                    value={formData.numeroCarnetDiscapacidad}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {discapacidad && (
              <div className="flex flex-wrap gap-4 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-3 2xl:col-span-3">
                {discapacidades.map((discapacidad) => (
                  <Popover
                    key={discapacidad.Discapacidad.id}
                    placement="bottom"
                    showArrow={true}
                  >
                    <PopoverTrigger>
                      <Chip
                        variant="shadow"
                        onClose={() => handleCloseDiscapacidad(discapacidad)}
                        classNames={{
                          base: "bg-gradient-to-br from-indigo-500 dark:from-gray-200 to-blue-500 dark:to-gray-800 border-small border-white/50 shadow-blue-500/30 dark:shadow-gray-900/30 cursor-pointer",
                          content:
                            "drop-shadow shadow-black text-white dark:text-black",
                          closeButton: "text-red-400",
                        }}
                      >
                        {discapacidad.Discapacidad.tipo}
                      </Chip>
                    </PopoverTrigger>
                    <PopoverContent className="dark:bg-gray-700">
                      <div className="px-1 py-2">
                        <div className="text-small font-bold dark:text-white">
                          {discapacidad.Discapacidad.tipo}
                        </div>
                        <div className="text-tiny dark:text-white">
                          {discapacidad.porcentaje}%
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}

                <div className="ml-3 inline-flex items-center  text-sm text-blue-900 cursor-pointer">
                  <Chip
                    onClick={onOpenDiscapacidad}
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
                    isOpen={isOpenDiscapacidad}
                    onOpenChange={onOpenChangeDiscapacidad}
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
                            Discapacidades
                          </ModalHeader>
                          <ModalBody>
                            <Autocomplete
                              label={
                                <label className="text-blue-900 dark:text-white">
                                  Discapacidad
                                </label>
                              }
                              isRequired={true}
                              labelPlacement="inside"
                              placeholder="Buscar discapacidad"
                              startContent={
                                <HeartSolidIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                              }
                              defaultItems={searchDiscapacidades}
                              disabledKeys={discapacidades.map((discapacidad) =>
                                String(discapacidad.Discapacidad.id)
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
                              //onInputChange={handleInputChangeDiscapacidad}
                              onSelectionChange={handleInputChangeDiscapacidad}
                            >
                              {(discapacidad) => (
                                <AutocompleteItem key={String(discapacidad.id)}>
                                  {discapacidad.tipo}
                                </AutocompleteItem>
                              )}
                            </Autocomplete>

                            <Slider
                              label={
                                <label className="text-blue-900 dark:text-white">
                                  Porcentaje
                                </label>
                              }
                              value={addPorcentajeDiscapacidad}
                              onChange={setAddPorcentajeDiscapacidad}
                              showTooltip={true}
                              step={1} // Cambia el paso a 1% en lugar de 0.01
                              maxValue={100} // El valor máximo ahora es 100
                              minValue={1} // El valor mínimo ahora es 1
                              marks={[
                                {
                                  value: 20,
                                  label: "20%",
                                },
                                {
                                  value: 40,
                                  label: "40%",
                                },
                                {
                                  value: 60,
                                  label: "60%",
                                },
                                {
                                  value: 80,
                                  label: "80%",
                                },
                                {
                                  value: 100,
                                  label: "100%",
                                },
                              ]}
                              defaultValue={1} // El valor por defecto también debe reflejar el rango correcto
                              className="max-w-md"
                              classNames={{
                                mark: "text-blue-900 dark:text-white",
                                value: "text-blue-900 dark:text-white",
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
                                // Controlar que no se pueda añadir una discapacidad sin un porcentaje ni una discapacidad seleccionada
                                if (addDiscapacidad.id) {
                                  // Si hay una discapacidad seleccionada
                                  console.log(
                                    "Discapacidad: ",
                                    addDiscapacidad
                                  );
                                  handleAddDiscapacidad();
                                  onClose();
                                } else {
                                  setNotificacion({
                                    message:
                                      "Por favor, ingrese una discapacidad",
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
            )}

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
