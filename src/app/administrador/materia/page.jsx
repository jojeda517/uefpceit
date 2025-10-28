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
} from "@nextui-org/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
  LightBulbIcon,
  BookOpenIcon,
  ScaleIcon,
} from "@heroicons/react/24/solid";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function Paralelo() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const [asignaturas, setAsignaturas] = useState([]);
  const [asignatura, setAsignatura] = useState("");

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
    column: "especialidad",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "especialidad", uid: "especialidad", sortable: false },
    { name: "nivel", uid: "nivel", sortable: false },
    { name: "materias", uid: "materias", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [materiasRes, especialidadesRes, asignaturasRes] =
        await Promise.all([
          fetch("/api/materia"),
          fetch("/api/especialidad/especialidad"),
          fetch("/api/materia/asignatura"),
        ]);

      const [materiasData, especialidadesData, asignaturasData] =
        await Promise.all([
          materiasRes.json(),
          especialidadesRes.json(),
          asignaturasRes.json(),
        ]);

      const transformedMaterias = materiasData.map((materia) => ({
        id: materia.id,
        especialidad: materia.especialidad,
        nivel: materia.nivel,
        materias: materia.materias.map((m) => m.nombre),
      }));

      // Ordenar por el ID en orden descendente
      const sortedMaterias = transformedMaterias.sort((a, b) => b.id - a.id);

      setItems(sortedMaterias);
      setPages(Math.ceil(transformedMaterias.length / rowsPerPage));
      setFilteredItems(transformedMaterias);
      setEspecialidades(especialidadesData);
      setAsignaturas(asignaturasData);
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
      item.especialidad.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleInputChangeAsignatura = (value) => {
    setAsignatura(value);
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
      setIdEspecialidad("");
      setSelectedEspecialidad(null);
      setIdNivel("");
      setSelectedNivel(null);
      setNiveles([]);
      setAsignatura("");
    } catch (error) {
      setNotificacion({
        message: "Error al limpiar los campos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbrirAsignatura = async () => {
    try {
      setIsLoading(true);

      const body = {
        idEspecialidad: idEspecialidad,
        idNivel: idNivel,
        nombre: asignatura,
      };

      const response = await fetch("/api/materia", {
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
          message: data.message || "Asignatura abierta exitosamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message: data.message || "Ocurrió un error al guardar la asignatura",
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
      case "materias":
        return (
          <div className="flex flex-col gap-1 place-self-center">
            {item[columnKey].map((materia, index) => (
              <Chip
                key={index}
                size="sm"
                variant="faded"
                className="w-max mx-auto"
              >
                {materia}
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
            Asignaturas
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de las asignaturas de la institución.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por especialidad..."
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
                        Abrir nueva asignatura
                      </ModalHeader>
                      <ModalBody>
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
                              Asignatura
                            </label>
                          }
                          allowsCustomValue
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar el nivel"
                          //onSelectionChange={onSelectionAsignatura}
                          onInputChange={handleInputChangeAsignatura}
                          startContent={
                            <BookOpenIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={asignaturas}
                          //defaultSelectedKey={String(idAsignatura)}
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
                          {(a) => (
                            <AutocompleteItem
                              key={String(a.id)}
                              className="capitalize"
                            >
                              {a.nombre}
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
                            handleAbrirAsignatura();
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
            Total: {filteredItems.length} niveles.
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
                <TableCell className="text-center capitalize">
                  {item.especialidad}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.nivel}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {renderCell(item, "materias")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Paralelo;
