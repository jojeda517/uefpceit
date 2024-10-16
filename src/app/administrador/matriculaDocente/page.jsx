"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Checkbox,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Autocomplete,
  AutocompleteItem,
  Pagination,
  User,
} from "@nextui-org/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  LightBulbIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  InboxIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import HandThumbUpIcon from "@/app/components/HandThumbUpIcon.jsx";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function MatriculaDocente() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const [docentes, setDocentes] = useState([]);
  const [idDocente, setIdDocente] = useState("");
  const [selectedDocente, setSelectedDocente] = useState(null);

  const [campus, setCampus] = useState([]);
  const [idCampus, setIdCampus] = useState("");
  const [selectedCampus, setSelectedCampus] = useState(null);

  const [periodos, setPeriodos] = useState([]);
  const [idPeriodos, setIdPeriodos] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);

  const [especialidades, setEspecialidades] = useState([]);
  const [idEspecialidad, setIdEspecialidad] = useState("");
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);

  const [niveles, setNiveles] = useState([]);
  const [idNivel, setIdNivel] = useState("");
  const [selectedNivel, setSelectedNivel] = useState(null);

  const [paralelos, setParalelos] = useState([]);
  const [idParalelo, setIdParalelo] = useState("");
  const [selectedParalelo, setSelectedParalelo] = useState(null);

  const [materias, setMaterias] = useState([]);
  const [idMateria, setIdMateria] = useState("");
  const [selectedMateria, setSelectedMateria] = useState(null);

  const [isSelectedMatricula, setIsSelectedMatricula] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const {
    isOpen: isOpenMatricula,
    onOpen: onOpenMatricula,
    onOpenChange: onOpenChangeMatricula,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "docente",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "docente", uid: "docente", sortable: false },
    { name: "Campus", uid: "campus", sortable: false },
    { name: "Periodo", uid: "periodo", sortable: false },
    { name: "especialidad", uid: "especialidad", sortable: false },
    { name: "nivel", uid: "nivel", sortable: false },
    { name: "materia", uid: "materia", sortable: false },
    { name: "paralelo", uid: "paralelo", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [matriculasRes, campusRes, periodosRes, docentesRes] =
        await Promise.all([
          fetch("/api/matriculaDocente"),
          fetch("/api/campus"),
          fetch("/api/periodo/activo"),
          fetch("/api/persona/docente"),
        ]);

      const [matriculasData, campusData, periodosData, docentesData] =
        await Promise.all([
          matriculasRes.json(),
          campusRes.json(),
          periodosRes.json(),
          docentesRes.json(),
        ]);

      const transformedMatriculas = matriculasData.map((matricula) => ({
        id: matricula.id,
        estudiante: matricula.PERSONA.nombre + " " + matricula.PERSONA.apellido,
        foto: matricula.PERSONA.foto,
        correo: matricula.PERSONA.usuario.correo,
        campus: matricula.CAMPUS,
        periodo: matricula.PERIODO,
        especialidad: matricula.ESPECIALIDAD,
        materia: matricula.MATERIA,
        nivel: matricula.NIVEL,
        paralelo: matricula.PARALELO,
      }));

      // Ordenar por el ID en orden descendente
      const sortedMatriculas = transformedMatriculas.sort(
        (a, b) => b.id - a.id
      );

      setItems(sortedMatriculas);
      setPages(Math.ceil(transformedMatriculas.length / rowsPerPage));
      setFilteredItems(transformedMatriculas);
      setCampus(campusData);
      setPeriodos(periodosData);
      setDocentes(docentesData);
      setIsClient(true);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!selectedCampus) return; // No hacer nada si no hay campus seleccionado

    const fetchEspecialidades = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/especialidad/campus/${selectedCampus}`);
        const data = await res.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error fetching especialidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEspecialidades();
  }, [selectedCampus]);

  useEffect(() => {
    if (!selectedEspecialidad) return; // No hacer nada si no hay especialidad seleccionada

    const fetchNiveles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/nivel/especialidad/${selectedEspecialidad}`
        );
        const data = await res.json();
        setNiveles(data);
      } catch (error) {
        console.error("Error fetching niveles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNiveles();
  }, [selectedEspecialidad]);

  useEffect(() => {
    if (!selectedNivel) return; // No hacer nada si no hay nivel seleccionado

    const fetchParalelos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/paralelo/${selectedNivel}/${selectedEspecialidad}/${selectedCampus}`
        );
        const data = await res.json();
        setParalelos(data);
      } catch (error) {
        console.error("Error fetching paralelos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParalelos();
  }, [selectedNivel, selectedEspecialidad, selectedCampus]);

  useEffect(() => {
    if (!selectedParalelo) return; // No hacer nada si no hay paralelo seleccionado

    const fetchMaterias = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/materia/${selectedCampus}/${selectedEspecialidad}/${selectedNivel}/${selectedParalelo}`
        );
        const data = await res.json();
        setMaterias(data);
      } catch (error) {
        console.error("Error fetching materias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterias();
  }, [selectedParalelo, selectedCampus, selectedEspecialidad, selectedNivel]);

  useEffect(() => {
    if (
      !selectedPeriodo ||
      !selectedDocente ||
      !selectedParalelo ||
      !selectedNivel ||
      !selectedEspecialidad ||
      !selectedCampus
    )
      return; // No hacer nada si no hay campus o docente seleccionado

    const fetchMatricula = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/matricula/${idPeriodos}/${idDocente}`);
        const data = await res.json();

        if (data.length) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error fetching matricula:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatricula();
  }, [
    idPeriodos,
    idDocente,
    selectedPeriodo,
    selectedDocente,
    selectedParalelo,
    selectedNivel,
    selectedEspecialidad,
    selectedCampus,
  ]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filtered = items.filter((item) =>
      item.estudiante.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const onSelectionCampus = (id) => {
    setIdCampus(id);
    setSelectedCampus(id);
  };

  const onSelectionDocente = (id) => {
    setIdDocente(id);
    setSelectedDocente(id);
  };

  const onSelectionPeriodo = (id) => {
    setIdPeriodos(id);
    setSelectedPeriodo(id);
  };

  const onSelectionEspecialidad = (id) => {
    setIdEspecialidad(id);
    setSelectedEspecialidad(id);
  };

  const onSelectionNivel = (id) => {
    setIdNivel(id);
    setSelectedNivel(id);
  };

  const onSelectionParalelo = (id) => {
    setIdParalelo(id);
    setSelectedParalelo(id);
  };

  const onSelectionMateria = (id) => {
    setIdMateria(id);
    setSelectedMateria(id);
  };

  const handleClear = () => {
    try {
      setIsLoading(true);

      setIdCampus("");
      setSelectedCampus(null);
      setIdEspecialidad("");
      setSelectedEspecialidad(null);
      setEspecialidades([]);
      setIdNivel("");
      setSelectedNivel(null);
      setNiveles([]);
      setIdParalelo("");
      setSelectedParalelo(null);
      setParalelos([]);
      setIdEstudiante("");
      setSelectedEstudiante(null);
      setIdPeriodos("");
      setSelectedPeriodo(null);
      setIsSelectedMatricula(false);
      setIsVisible(false);
    } catch (error) {
      setNotificacion({
        message: "Error al limpiar los campos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatricular = async () => {
    try {
      setIsLoading(true);

      // si es visible y no esta seleccionado la matricula se elimina
      if (isVisible && !isSelectedMatricula) {
        setNotificacion({
          message: "El estudiante ya está matriculado",
          type: "warning",
        });
        return;
      }

      const body = {
        idEstudiantePertenece: idEstudiante,
        idPeriodoPertenece: idPeriodos,
        idCampusPertenece: idCampus,
        idEspecialidadPertenece: idEspecialidad,
        idNivelPertenece: idNivel,
        idParaleloPertenece: idParalelo,
      };

      const response = await fetch("/api/matricula", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Verificar si la respuesta es un PDF
      const contentType = response.headers.get("Content-Type");

      if (response.ok) {
        if (contentType === "application/pdf") {
          // Descargar el archivo PDF
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `matricula_estudiante_${idEstudiante}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();

          // Mostrar notificación de éxito
          setNotificacion({
            message: "Matrícula realizada con éxito y PDF descargado.",
            type: "success",
          });
        } else {
          // Si la respuesta es JSON, manejar normalmente
          const data = await response.json();
          setNotificacion({
            message: data.message || "Matrícula realizada con éxito",
            type: "success",
          });
        }

        // Actualizar la lista de matriculas
        fetchInitialData();
      } else {
        const data = await response.json();
        setNotificacion({
          message:
            data.message || "Ocurrió un error al matricular al estudiante",
          type: "error",
        });
      }
    } catch (error) {
      setNotificacion({
        message: "Error de red o de servidor",
        type: "error",
      });
    } finally {
      handleClear();
      setIsLoading(false);
    }
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "docente":
        // mostrar foto y nombres del docente y debajo del nombre el correo
        return (
          <User
            avatarProps={{ radius: "lg", src: item.foto }}
            description={item.correo.toLowerCase()}
            name={item.docente}
          >
            {item.correo}
          </User>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      {isLoading && <CircularProgress />}
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Docentes Matriculados
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de la matrícula de docentes.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<MagnifyingGlassIcon className="h-6 w-6" />}
            value={searchValue}
            vaariant="bordered"
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              base: "",
              input: "text-gray-900 dark:text-white",
              inputWrapper:
                "bg-gray-100 dark:bg-gray-800 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
            }}
          />
          <div className="flex gap-3">
            <div>
              <Button
                className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-md"
                endContent={<PlusIcon className="h-5 w-5" />}
                onClick={onOpenMatricula}
              >
                Añadir Nuevo
              </Button>
              <Modal
                isOpen={isOpenMatricula}
                onOpenChange={onOpenChangeMatricula}
                onClose={() => {
                  handleClear();
                }}
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
                        Matricular estudiante
                      </ModalHeader>
                      <ModalBody>
                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Campus
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar campus"
                          onSelectionChange={onSelectionCampus}
                          startContent={
                            <BuildingOffice2Icon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={campus}
                          defaultSelectedKey={String(idCampus)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(c) => (
                            <AutocompleteItem
                              key={String(c.id)}
                              className="capitalize"
                            >
                              {c.nombre}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Docente
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar docente"
                          onSelectionChange={onSelectionDocente}
                          startContent={
                            <UserCircleIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={docentes}
                          defaultSelectedKey={String(idDocente)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(e) => (
                            <AutocompleteItem
                              key={String(e.id)}
                              className="capitalize"
                            >
                              {e.PERSONA.nombre + " " + e.PERSONA.apellido}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Periodo
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar periodo"
                          onSelectionChange={onSelectionPeriodo}
                          startContent={
                            <InboxIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={periodos}
                          defaultSelectedKey={String(idPeriodos)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(p) => (
                            <AutocompleteItem
                              key={String(p.id)}
                              className="capitalize"
                            >
                              {p.nombre}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Especialidad
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar especialidad"
                          onSelectionChange={onSelectionEspecialidad}
                          startContent={
                            <ScaleIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={especialidades}
                          defaultSelectedKey={String(idEspecialidad)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(e) => (
                            <AutocompleteItem
                              key={String(e.id)}
                              className="capitalize"
                            >
                              {e.especialidad}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Nivel
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar el nivel"
                          onSelectionChange={onSelectionNivel}
                          startContent={
                            <LightBulbIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={niveles}
                          defaultSelectedKey={String(idNivel)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(n) => (
                            <AutocompleteItem
                              key={String(n.id)}
                              className="capitalize"
                            >
                              {n.nivel}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Paralelo
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar el paralelo"
                          onSelectionChange={onSelectionParalelo}
                          startContent={
                            <ClipboardDocumentListIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={paralelos}
                          defaultSelectedKey={String(idParalelo)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(p) => (
                            <AutocompleteItem
                              key={String(p.PARALELO.id)}
                              className="capitalize"
                              textValue={p.PARALELO.paralelo}
                            >
                              {p.PARALELO.paralelo} - {p.TOTAL} estudiantes.
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Asignatura
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar la asignatura"
                          onSelectionChange={onSelectionMateria}
                          startContent={
                            <ClipboardDocumentListIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={materias}
                          defaultSelectedKey={String(idMateria)}
                          variant="bordered"
                          inputProps={{
                            className: "dark:text-white capitalize",
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
                        >
                          {(m) => (
                            <AutocompleteItem
                              key={String(m.id)}
                              className="capitalize"
                            >
                              {m.nombre}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        {/* mostrar checkbox si isVisible=true */}
                        {isVisible && (
                          <Checkbox
                            disableAnimation
                            icon={<HandThumbUpIcon />}
                            size="lg"
                            isSelected={isSelectedMatricula}
                            onValueChange={setIsSelectedMatricula}
                            color="danger"
                          >
                            <p className="dark:text-white">
                              El estudiante ya está matriculado, si lo añades se
                              borrarán los registros de la matrícula existente
                            </p>
                          </Checkbox>
                        )}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          className="bg-gradient-to-tr from-blue-900 to-red-500 text-white shadow-red-500 shadow-lg"
                          onPress={() => {
                            handleClear();
                            onClose();
                          }}
                        >
                          Cerrar
                        </Button>
                        <Button
                          className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
                          onPress={() => {
                            handleMatricular();
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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 dark:text-gray-300 text-small">
            Total: {filteredItems.length} docentes matriculados.
          </span>
        </div>
      </div>

      {isClient && (
        <Table
          aria-label="Tabla de periodos académicos"
          isHeaderSticky
          classNames={{
            wrapper: "dark:bg-gray-700", // Es necesario ajustar la altura máxima de la tabla
            th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase", // Es la cabecera
            tr: "dark:text-white dark:hover:text-gray-900 text-justify", // Es la fila
          }}
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                loop
                isCompact
                showControls
                //color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                classNames={{
                  prev: "bg-gradient-to-b dark:from-default-600 dark:to-default-900 bg-gray-300 dark:text-white text-blue-900 font-bold",
                  next: "bg-gradient-to-b dark:from-default-600 dark:to-default-900 bg-gray-300 dark:text-white text-blue-900 font-bold",
                  item: "dark:bg-default-700 bg-gray-200 dark:text-white text-blue-900 font-bold",
                  cursor:
                    "bg-gradient-to-b dark:from-default-500 dark:to-default-800 text-white font-bold hover:bg-pink-900",
                }}
              />
            </div>
          }
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
          selectionMode="single"
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "acciones" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-center">
                  {renderCell(item, "docente")}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.campus}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.periodo}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.especialidad}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.nivel}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.materia}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.paralelo}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default MatriculaDocente;
