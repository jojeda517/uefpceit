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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { BuildingOfficeIcon, MapPinIcon } from "@heroicons/react/24/solid";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

function Periodo() {
  const [id, setId] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [nombreCampus, setNombreCampus] = useState("");
  const [direccionCampus, setDireccionCampus] = useState("");
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const {
    isOpen: isOpenCampus,
    onOpen: onOpenCampus,
    onOpenChange: onOpenChangeCampus,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "campus",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "Campus", uid: "campus", sortable: false },
    { name: "Dirección", uid: "direccion", sortable: false },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [campusRes] = await Promise.all([fetch("/api/campus")]);

      const [campusData] = await Promise.all([campusRes.json()]);

      const transformedCampus = campusData.map((campus) => ({
        id: campus.id,
        campus: campus.nombre,
        direccion: campus.direccion,
      }));

      // Ordenar por el ID en orden descendente
      const sortedCampus = transformedCampus.sort((a, b) => b.id - a.id);

      setItems(sortedCampus);
      setPages(Math.ceil(transformedCampus.length / rowsPerPage));
      setFilteredItems(transformedCampus);
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
      item.campus.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleEditClick = (item) => {
    try {
      setIsLoading(true);
      setId(item.id);
      setNombreCampus(item.campus);
      setDireccionCampus(item.direccion);
      onOpenCampus();
    } catch (error) {
      handleClear();
      setNotificacion({
        message: "Error al editar el campus",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    try {
      setIsLoading(true);
      setId("");
      setNombreCampus("");
      setDireccionCampus("");
    } catch (error) {
      setNotificacion({
        message: "Error al limpiar los campos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbrirCampus = async () => {
    try {
      setIsLoading(true);
      handleClear();
      const body = {
        nombre: nombreCampus,
        direccion: direccionCampus,
      };

      // Verifica si el `id` existe y, si es así, lo agrega al body
      if (id) {
        body.id = id;
      }

      const response = await fetch("/api/campus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar la lista de periodos con el nuevo periodo creado
        fetchInitialData();
        setNotificacion({
          message: data.message || "Campus guardado exitosamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message: data.message || "Ocurrió un error al guardar el campus",
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
      case "acciones":
        return (
          <div className="relative flex items-center gap-2 place-content-center">
            <Tooltip content="Editar campus">
              <span
                onClick={() => handleEditClick(item)}
                className="text-lg text-blue-900 cursor-pointer active:opacity-50"
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
            Campus
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de los campus de la institución.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por campus..."
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
                onClick={onOpenCampus}
              >
                Añadir Nuevo
              </Button>
              <Modal
                isOpen={isOpenCampus}
                onOpenChange={onOpenChangeCampus}
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
                        Abrir nuevo campus
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          type="text"
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Campus
                            </label>
                          }
                          startContent={
                            <BuildingOfficeIcon className="h-6 w-6 text-blue-900 dark:text-white" />
                          }
                          placeholder="Matriz"
                          variant="bordered"
                          value={nombreCampus}
                          onValueChange={setNombreCampus}
                          classNames={{
                            base: "",
                            input: "text-gray-900 dark:text-white",
                            inputWrapper:
                              "bg-gray-100 dark:bg-gray-800 border border-blue-900 dark:border-black focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                            clearButton: "text-red-400", // Es el icono de limpiar el input
                          }}
                        />

                        <Input
                          type="text"
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Dirección
                            </label>
                          }
                          startContent={
                            <MapPinIcon className="h-6 w-6 text-blue-900 dark:text-white" />
                          }
                          placeholder="Ambato, Ecuador"
                          variant="bordered"
                          value={direccionCampus}
                          onValueChange={setDireccionCampus}
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
                            handleAbrirCampus();
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
            Total: {filteredItems.length} campus.
          </span>
        </div>
      </div>

      {isClient && (
        <Table
          aria-label="Tabla de campos de la institución"
          isHeaderSticky
          classNames={{
            wrapper: "dark:bg-gray-700", // Es necesario ajustar la altura máxima de la tabla
            th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase", // Es la cabecera
            tr: "dark:text-white dark:hover:text-gray-900 text-center", // Es la fila
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
                  {item.direccion}
                </TableCell>
                <TableCell className="text-center">
                  {renderCell(item, "acciones")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Periodo;
