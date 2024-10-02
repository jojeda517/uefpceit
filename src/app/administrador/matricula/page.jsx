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
  Chip,
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
} from "@heroicons/react/24/solid";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function Matricula() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const [estudiantes, setEstudiantes] = useState([]);
  const [idEstudiante, setIdEstudiante] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);

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

  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const {
    isOpen: isOpenParalelo,
    onOpen: onOpenParalelo,
    onOpenChange: onOpenChangeParalelo,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "paralelo",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "Estudiante", uid: "estudiante", sortable: false },
    { name: "Campus", uid: "campus", sortable: false },
    { name: "Periodo", uid: "periodo", sortable: false },
    { name: "especialidad", uid: "especialidad", sortable: false },
    { name: "nivel", uid: "nivel", sortable: false },
    { name: "paralelo", uid: "paralelo", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        matriculasRes,
        paralelosRes,
        campusRes,
        periodosRes,
        estudiantesRes,
      ] = await Promise.all([
        fetch("/api/matricula"),
        fetch("/api/paralelo"),
        fetch("/api/campus"),
        fetch("/api/periodo/activo"),
        fetch("/api/persona/estudiante"),
      ]);

      const [
        matriculasData,
        paralelosData,
        campusData,
        periodosData,
        estudiantesData,
      ] = await Promise.all([
        matriculasRes.json(),
        paralelosRes.json(),
        campusRes.json(),
        periodosRes.json(),
        estudiantesRes.json(),
      ]);

      const transformedMatriculas = matriculasData.map((matricula) => ({
        id: matricula.PERSONA.usuario.correo,
        estudiante: matricula.PERSONA.nombre + " " + matricula.PERSONA.apellido,
        foto: matricula.PERSONA.foto,
        correo: matricula.PERSONA.usuario.correo,
        campus: matricula.MATRICULA.CAMPUS,
        periodo: matricula.MATRICULA.PERIODO,
        especialidad: matricula.MATRICULA.ESPECIALIDAD,
        nivel: matricula.MATRICULA.NIVEL,
        paralelo: matricula.MATRICULA.PARALELO,
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
      setEstudiantes(estudiantesData);
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

  const onSelectionEstudiante = (id) => {
    setIdEstudiante(id);
    setSelectedEstudiante(id);
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
    } catch (error) {
      setNotificacion({
        message: "Error al limpiar los campos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbrirEspecialidad = async () => {
    try {
      setIsLoading(true);

      const body = {
        idCampusPertenece: idCampus,
        idEspecialidadPertenece: idEspecialidad,
        idNivelPertenece: idNivel,
      };

      const response = await fetch("/api/paralelo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar la lista de especialidades con la nueva especialidad creada
        fetchInitialData();
        setNotificacion({
          message: data.message || "Paralelo abierto exitosamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message:
            data.message || "Ocurrió un error al guardar la especialidad",
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
      case "estudiante":
        // mostrar foto y nombres del estudienate y debajo del nombre el correo
        return (
          <User
            avatarProps={{ radius: "lg", src: item.foto }}
            description={item.correo.toLowerCase()}
            name={item.estudiante}
          >
            {item.correo}
          </User>
        );
      case "paralelos":
        return (
          <div className="flex flex-col gap-1 place-self-center">
            {item[columnKey].map((paralelo, index) => (
              <Chip
                key={index}
                size="sm"
                variant="faded"
                className="w-max mx-auto"
              >
                {/* poner los paralelos entre "" */}
                {paralelo}
              </Chip>
            ))}
          </div>
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
            Matriculas
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de las matriculas de la institución.
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
                onClick={onOpenParalelo}
              >
                Añadir Nuevo
              </Button>
              <Modal
                isOpen={isOpenParalelo}
                onOpenChange={onOpenChangeParalelo}
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
                              Estudiante
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar estudiante"
                          onSelectionChange={onSelectionEstudiante}
                          startContent={
                            <BuildingOffice2Icon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={estudiantes}
                          defaultSelectedKey={String(idEstudiante)}
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
                            handleAbrirEspecialidad();
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
            Total: {filteredItems.length} estudiantes matriculados.
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
                  {renderCell(item, "estudiante")}
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

export default Matricula;
