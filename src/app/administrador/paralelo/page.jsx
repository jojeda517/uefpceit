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
  Select,
  SelectItem,
  Textarea,
  DateRangePicker,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import {
  LightBulbIcon,
  TrophyIcon,
  BuildingOffice2Icon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";

import { parseDate, getLocalTimeZone } from "@internationalized/date";
import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function Paralelo() {
  const [id, setId] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const [especialidad, setEspecialidad] = useState("");

  const [niveles, setNiveles] = useState([]);
  const [idNivel, setIdNivel] = useState("");

  const [idUltimoNivel, setIdUltimoNivel] = useState("");

  const [campus, setCampus] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState([]);

  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const {
    isOpen: isOpenEspecialidad,
    onOpen: onOpenEspecialidad,
    onOpenChange: onOpenChangeEspecialidad,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "paralelo",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "campus", uid: "campus", sortable: false },
    { name: "especialidad", uid: "especialidad", sortable: false },
    { name: "nivel", uid: "nivel", sortable: false },
    { name: "paralelos", uid: "paralelos", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [paralelosRes, nivelesRes, campusRes] = await Promise.all([
        fetch("/api/paralelo"),
        fetch("/api/nivel"),
        fetch("/api/campus"),
      ]);

      const [paralelosData, nivelesData, campusData] = await Promise.all([
        paralelosRes.json(),
        nivelesRes.json(),
        campusRes.json(),
      ]);

      const transformedParalelos = paralelosData.map((paralelo) => ({
        id: paralelo.id,
        campus: paralelo.campus.nombre,
        especialidad: paralelo.especialidad.nombre,
        nivel: paralelo.nivel.nombre,
        paralelos: paralelo.paralelos.map((p) => p.nombre),
      }));

      // Ordenar por el ID en orden descendente
      const sortedParalelos = transformedParalelos.sort((a, b) => b.id - a.id);

      setItems(sortedParalelos);
      setPages(Math.ceil(transformedParalelos.length / rowsPerPage));
      setFilteredItems(transformedParalelos);
      setCampus(campusData);
      setNiveles(nivelesData);
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

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filtered = items.filter((item) =>
      item.paralelo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleEditClick = (item) => {
    try {
      setIsLoading(true);
      setId(item.id);
      setSelectedEspecialidad(item);
      setEspecialidad(item.especialidad);
      setIdNivel(niveles.find((n) => n.nivel === item.primerNivel).id);
      setIdUltimoNivel(niveles.find((n) => n.nivel === item.ultimoNivel).id);
      onOpenEspecialidad();

      // Obtener los campus seleccionados ej.: ["1", "2", "3"]
      const selectedCampusIds = item.campus
        .map((c) => {
          const campusData = campus.find((ca) => ca.nombre === c);
          // Verificar si campusData existe y tiene la propiedad id
          return campusData ? String(campusData.id) : null;
        })
        .filter((id) => id !== null); // Filtrar valores nulos si no se encontró la modalidad

      setSelectedCampus(selectedCampusIds);
    } catch (error) {
      setNotificacion({
        message: "Error al editar la especialidad",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectionNivel = (id) => {
    setIdNivel(id);
  };

  const onSelectionUltimoNivel = (id) => {
    setIdUltimoNivel(id);
  };

  const handleClear = () => {
    try {
      setIsLoading(true);
      setId("");
      setEspecialidad("");
      setSelectedCampus([]);
      setIdNivel("");
      setIdUltimoNivel("");
      setSelectedEspecialidad(null);
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
      // Transformar selectedCampus a la estructura requerida
      const campusSeleccionados = Array.from(selectedCampus).map(
        (idcampus) => ({
          idCampus: parseInt(idcampus, 10),
        })
      );

      const body = {
        especialidad: especialidad,
        campus: JSON.stringify(campusSeleccionados),
        idNivel: parseInt(idNivel, 10),
        idUltimoNivel: parseInt(idUltimoNivel, 10),
      };

      // Verifica si el `id` existe y, si es así, lo agrega al body
      if (id) {
        body.id = id;
      }

      const response = await fetch("/api/especialidad", {
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
          message: data.message || "Especialidad guardada exitosamente",
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
      case "acciones":
        return (
          <div className="relative flex items-center place-self-center gap-2">
            <Tooltip content="Editar especialidad">
              <span
                onClick={() => handleEditClick(item)}
                className="text-lg text-blue-900 cursor-pointer active:opacity-50 mx-auto"
              >
                <PencilSquareIcon className="h-6 w-6" />
              </span>
            </Tooltip>
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
            Paralelos
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de los paralelos de la institución.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por paralelos..."
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
                onClick={onOpenEspecialidad}
              >
                Añadir Nuevo
              </Button>
              <Modal
                isOpen={isOpenEspecialidad}
                onOpenChange={onOpenChangeEspecialidad}
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
                        Abrir nuevo paralelo
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          type="text"
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Especialidad
                            </label>
                          }
                          startContent={
                            <PuzzlePieceIcon className="h-6 w-6 text-blue-900 dark:text-white" />
                          }
                          placeholder="Informática"
                          variant="bordered"
                          value={especialidad}
                          onValueChange={setEspecialidad}
                          classNames={{
                            base: "",
                            input: "text-gray-900 dark:text-white",
                            inputWrapper:
                              "bg-gray-100 dark:bg-gray-800 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                            clearButton: "text-red-400", // Es el icono de limpiar el input
                          }}
                        />

                        <Select
                          items={campus}
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Campus
                            </label>
                          }
                          variant="bordered"
                          isMultiline={true}
                          selectionMode="multiple"
                          placeholder="Selecciona los campus"
                          labelPlacement="inside"
                          defaultSelectedKeys={selectedCampus}
                          startContent={
                            <BuildingOffice2Icon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          selectedKeys={selectedCampus}
                          onSelectionChange={setSelectedCampus}
                          classNames={{
                            base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                            selectorIcon: "text-blue-900 dark:text-black",
                            popoverContent:
                              "bg-gray-100 dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                            trigger: "min-h-12 py-2",
                          }}
                          renderValue={(items) => {
                            return (
                              <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                  <Chip
                                    key={item.key}
                                    color="primary"
                                    variant="bordered"
                                    classNames={{
                                      base: "dark:text-white dark:border-gray-900 capitalize",
                                    }}
                                  >
                                    {item.data.nombre}
                                  </Chip>
                                ))}
                              </div>
                            );
                          }}
                        >
                          {(c) => (
                            <SelectItem key={c.id} textValue={c.nombre}>
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                  <span className="text-small capitalize">
                                    {c.nombre}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          )}
                        </Select>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Primer nivel
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar primer nivel"
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
                              Último nivel
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar último nivel"
                          onSelectionChange={onSelectionUltimoNivel}
                          startContent={
                            <TrophyIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={niveles}
                          defaultSelectedKey={String(idUltimoNivel)}
                          // Desactivar niveles con id inferior a idNivel
                          disabledKeys={niveles
                            .filter(
                              (n) => parseInt(n.id, 10) < parseInt(idNivel, 10)
                            )
                            .map((n) => String(n.id))}
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
                            if (
                              idNivel &&
                              idUltimoNivel &&
                              parseInt(idNivel, 10) <=
                                parseInt(idUltimoNivel, 10)
                            ) {
                              handleAbrirEspecialidad();
                              onClose();
                            } else {
                              setNotificacion({
                                message:
                                  "El último nivel debe ser mayor o igual al primer nivel",
                                type: "error",
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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 dark:text-gray-300 text-small">
            Total: {filteredItems.length} paralelos.
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
                  {item.campus}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.especialidad}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {item.nivel}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {renderCell(item, "paralelos")}
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
