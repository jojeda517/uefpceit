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
  Select,
  SelectItem,
  Textarea,
  DateRangePicker,
  DateInput,
  Pagination,
} from "@nextui-org/react";
import {
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { BoltIcon } from "@heroicons/react/24/solid";

import { CalendarDate, parseDate } from "@internationalized/date";
import { ClassNames } from "@emotion/react";

function Periodo() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [tiposPeriodos, setTiposPeriodos] = useState([]);
  const [idTipoPeriodo, setIdTipoPeriodo] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [idEvaluacion, setIdEvaluacion] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
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
    { name: "Inicio", uid: "fechaInicio", sortable: true },
    { name: "Fin", uid: "fechaFin", sortable: true },
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
          fechaInicio: new Date(periodo.fechaInicio)
            .toISOString()
            .split("T")[0],
          fechaFin: new Date(periodo.fechaFin).toISOString().split("T")[0],
          estado: periodo.estado ? "Cerrado" : "Activo",
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

  const onSelectionTipoPeriodo = (id) => {
    setIdTipoPeriodo(id);
  };

  useEffect(() => {
    const fetchEvaluacion = async () => {
      if (idTipoPeriodo) {
        try {
          const response = await fetch("/api/evaluacion/" + idTipoPeriodo);
          const data = await response.json();
          setEvaluaciones(data);
        } catch (error) {
          console.error("Error fetching evaluaciones:", error);
        }
      } else {
        setEvaluaciones([]); // Clear evaluaciones when no tipoPeriodo is selected
      }
    };
    fetchEvaluacion();
  }, [idTipoPeriodo]);

  const onSelectionEvaluacion = (id) => {
    setIdEvaluacion(id);
  };

  useEffect(() => {
    const fetchModalidad = async () => {
      try {
        const response = await fetch("/api/modalidad");
        const data = await response.json();
        setModalidades(data);
      } catch (error) {
        console.error("Error fetching modalidades:", error);
      }
    };
    fetchModalidad();
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
                          placeholder="Buscar tipo de periodo"
                          onSelectionChange={onSelectionTipoPeriodo}
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
                        >
                          {(tipo) => (
                            <AutocompleteItem key={String(tipo.id)}>
                              {tipo.metodo}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>

                        <Autocomplete
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Evaluaciones
                            </label>
                          }
                          isRequired={true}
                          isDisabled={!idTipoPeriodo} // Disable when no tipoPeriodo is selected
                          labelPlacement="inside"
                          placeholder="Buscar evaluaciones"
                          onSelectionChange={onSelectionEvaluacion}
                          startContent={
                            <BoltIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          defaultItems={evaluaciones}
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
                        >
                          {(evaluacion) => (
                            <AutocompleteItem key={String(evaluacion.id)}>
                              {evaluacion.evaluacion}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                        {/* <p className="text-pink-500">{idEvaluacion}</p> */}

                        <Select
                          items={modalidades}
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Modalidades
                            </label>
                          }
                          variant="bordered"
                          isMultiline={true}
                          selectionMode="multiple"
                          placeholder="Selecciona las modalidades"
                          labelPlacement="inside"
                          selectedKeys={selectedModalidades}
                          onSelectionChange={setSelectedModalidades}
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
                                      base: "dark:text-white dark:border-gray-900",
                                    }}
                                  >
                                    {item.data.modalidad}
                                  </Chip>
                                ))}
                              </div>
                            );
                          }}
                        >
                          {(modalidad) => (
                            <SelectItem
                              key={modalidad.id}
                              textValue={modalidad.modalidad}
                            >
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                  <span className="text-small">
                                    {modalidad.modalidad}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          )}
                        </Select>
                        {/* <p className="text-small text-default-500">
                          Selected: {Array.from(selectedModalidades).join(", ")}
                        </p> */}

                        <DateRangePicker
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Periodo académico
                            </label>
                          }
                          vocab="es"
                          variant="bordered"
                          visibleMonths={2}
                          classNames={{
                            base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black text-blue-900",
                            selectorIcon: "text-blue-900 dark:text-white",
                            separator: "text-blue-900 dark:text-white",
                            segment: "text-blue-900 dark:text-white",
                            segmentActive: "bg-blue-900 text-white",
                            calendarContent: "bg-gray-100 dark:bg-gray-600",
                          }}
                          calendarProps={{
                            classNames: {
                              headerWrapper: "bg-gray-300 dark:bg-gray-800",
                              gridHeader: "bg-gray-300 dark:bg-gray-800",
                              gridHeaderCell: "text-blue-900 dark:text-white",
                              nextButton: "text-blue-900 dark:text-white",
                              prevButton: "text-blue-900 dark:text-white",
                              title: "text-blue-900 dark:text-white",
                            },
                          }}
                          /* defaultValue={{
                            start: parseDate("2025-01-01"),
                            end: parseDate("2025-05-01"),
                          }} */
                        />

                        <Textarea
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Descripción del periodo
                            </label>
                          }
                          variant="bordered"
                          placeholder="Escribe una descripción del periodo"
                          disableAnimation
                          maxRows={3}
                          classNames={{
                            base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black dark:text-white",
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
