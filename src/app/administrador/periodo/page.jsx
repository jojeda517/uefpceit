"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
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
import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { BoltIcon } from "@heroicons/react/24/solid";

function Periodo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [tiposPeriodos, setTiposPeriodos] = useState([]);
  const {
    isOpen: isOpenPeriodo,
    onOpen: onOpenPeriodo,
    onOpenChange: onOpenChangePeriodo,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "periodo",
    direction: "ascending",
  });
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);

  const headerColumns = [
    { name: "Periodo", uid: "periodo", sortable: true },
    { name: "Tipo periodo", uid: "tipoPeriodo", sortable: true },
    { name: "Evaluación", uid: "evaluacion", sortable: true },
    { name: "Modalidades", uid: "modalidades", sortable: true },
    { name: "Descripción", uid: "descripcion", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
  ];

  useEffect(() => {
    const fetchPeriodos = async () => {
      try {
        const response = await fetch("/api/periodo");
        const data = await response.json();

        const transformedData = data.map((periodo) => ({
          id: periodo.id,
          periodo: periodo.nombre,
          tipoPeriodo: periodo.evaluacion.metodoEvaluacion.metodo,
          evaluacion: periodo.evaluacion.evaluacion,
          modalidades: periodo.periodosModalidad.map(
            (pm) => pm.modalidad.modalidad
          ),
          estado: periodo.estado ? "Activo" : "Inactivo",
          descripcion: periodo.descripcion,
        }));

        setItems(transformedData);
        setFilteredItems(transformedData);
        setIsClient(true);
      } catch (error) {
        console.error("Error fetching periodos:", error);
      }
    };

    fetchPeriodos();
  }, []);

  useEffect(() => {
    const fetchTipoPeriodo = async () => {
      try {
        const response = await fetch("/api/tipoPeriodo");
        const data = await response.json();
        setTiposPeriodos(data);
      } catch (error) {
        console.error("Error fetching tipo de periodos:", error);
      }
    };
    fetchTipoPeriodo();
  }, []);

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filtered = items.filter((item) =>
      item.periodo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const onClear = () => {
    setSearchValue("");
    setFilteredItems(items);
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "modalidades":
        return (
          <div className="flex flex-col gap-1">
            {item[columnKey].map((modalidad, index) => (
              <Chip key={index} size="sm" variant="faded" className="w-max">
                {modalidad}
              </Chip>
            ))}
          </div>
        );
      case "estado":
        return (
          <Chip
            color={item[columnKey] === "Activo" ? "success" : "danger"}
            variant="dot"
          >
            {item[columnKey]}
          </Chip>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 h-screen w-full px-10">
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Periodos Académicos
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de los periodos académicos de la escuela.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por periodo..."
            startContent={<MagnifyingGlassIcon className="h-6 w-6" />}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <ChevronDownIcon className="text-small h-3 w-3" />
                  }
                  variant="flat"
                >
                  Estado
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filtrar por estado"
                closeOnSelect={false}
              >
                <DropdownItem key="activo">Activo</DropdownItem>
                <DropdownItem key="inactivo">Inactivo</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <div>
              <Button
                className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-md"
                endContent={<PlusIcon className="h-5 w-5" />}
                onClick={onOpenPeriodo}
              >
                Añadir Nuevo
              </Button>
              <Modal
                isOpen={isOpenPeriodo}
                onOpenChange={onOpenChangePeriodo}
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
                        Abrir nuevo periodo
                      </ModalHeader>
                      <ModalBody>
                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Tipo de periodo
                            </label>
                          }
                          isRequired={true}
                          labelPlacement="inside"
                          placeholder="Buscar discapacidad"
                          startContent={
                            <BoltIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={tiposPeriodos}
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
                          //onSelectionChange={handleInputChangeDiscapacidad}
                        >
                          {(tipo) => (
                            <AutocompleteItem key={String(tipo.id)}>
                              {tipo.metodo}
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
                          onPress={onClose}
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
          <span className="text-default-400 text-small">
            Total {filteredItems.length} periodos
          </span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select className="bg-transparent outline-none text-default-400 text-small">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>

      {isClient && (
        <Table
          aria-label="Tabla de periodos académicos"
          isHeaderSticky
          classNames={{
            wrapper: "max-h-[382px]  dark:bg-gray-600", // Es necesario ajustar la altura máxima de la tabla
            th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white", // Es la cabecera
            tr: "dark:text-white dark:hover:text-gray-900", // Es la fila
          }}
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
          <TableBody
            emptyContent={"No se encontraron periodos"}
            items={filteredItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Periodo;
