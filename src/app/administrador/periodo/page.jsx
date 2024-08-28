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
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import {
  BoltIcon,
  ClipboardDocumentListIcon,
  AdjustmentsVerticalIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";

import { parseDate, getLocalTimeZone } from "@internationalized/date";
import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";
import { useDateFormatter } from "@react-aria/i18n";

function Periodo() {
  const [id, setId] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [tiposPeriodos, setTiposPeriodos] = useState([]);
  const [idTipoPeriodo, setIdTipoPeriodo] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [idEvaluacion, setIdEvaluacion] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [rangoFechas, setRangoFechas] = useState({
    start: parseDate("2025-01-01"),
    end: parseDate("2025-05-01"),
  });
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
    { name: "Periodo", uid: "periodo", sortable: false },
    { name: "Tipo periodo", uid: "tipoPeriodo", sortable: false },
    { name: "Evaluación", uid: "evaluacion", sortable: false },
    { name: "Modalidades", uid: "modalidades", sortable: false },
    { name: "Inicio", uid: "fechaInicio", sortable: false },
    { name: "Fin", uid: "fechaFin", sortable: false },
    { name: "Descripción", uid: "descripcion", sortable: false },
    { name: "Estado", uid: "estado", sortable: false },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [periodosRes, tipoPeriodoRes, modalidadRes] = await Promise.all([
        fetch("/api/periodo"),
        fetch("/api/tipoPeriodo"),
        fetch("/api/modalidad"),
      ]);

      const [periodosData, tipoPeriodoData, modalidadData] = await Promise.all([
        periodosRes.json(),
        tipoPeriodoRes.json(),
        modalidadRes.json(),
      ]);

      const transformedPeriodos = periodosData.map((periodo) => ({
        id: periodo.id,
        periodo: periodo.nombre,
        tipoPeriodo: periodo.evaluacion.metodoEvaluacion.metodo,
        evaluacion: periodo.evaluacion.evaluacion,
        modalidades: periodo.periodosModalidad.map(
          (pm) => pm.modalidad.modalidad
        ),
        fechaInicio: new Date(periodo.fechaInicio).toISOString().split("T")[0],
        fechaFin: new Date(periodo.fechaFin).toISOString().split("T")[0],
        estado: periodo.estado ? "Activo" : "Cerrado",
        descripcion: periodo.descripcion,
      }));

      // Ordenar por el ID en orden descendente
      const sortedPeriodos = transformedPeriodos.sort((a, b) => b.id - a.id);

      setItems(sortedPeriodos);
      setPages(Math.ceil(transformedPeriodos.length / rowsPerPage));
      setFilteredItems(transformedPeriodos);
      setTiposPeriodos(tipoPeriodoData);
      setModalidades(modalidadData);
      setIsClient(true);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEvaluacion = useCallback(async () => {
    if (idTipoPeriodo) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/evaluacion/${idTipoPeriodo}`);
        const data = await response.json();
        setEvaluaciones(data);
      } catch (error) {
        console.error("Error fetching evaluaciones:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEvaluaciones([]);
    }
  }, [idTipoPeriodo]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchEvaluacion();
  }, [fetchEvaluacion]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filtered = items.filter((item) =>
      item.periodo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleEditClick = (item) => {
    try {
      setIsLoading(true);
      setId(item.id);
      setSelectedPeriodo(item);
      setIdTipoPeriodo(
        tiposPeriodos.find((tp) => tp.metodo === item.tipoPeriodo).id
      );
      setDescripcion(item.descripcion);
      setRangoFechas({
        start: parseDate(item.fechaInicio),
        end: parseDate(item.fechaFin),
      });
      onOpenPeriodo();

      // Obtener las modalidades seleccionadas ej.: ["1", "2", "3"]
      const selectedModalidadesIds = item.modalidades
        .map((modalidad) => {
          const modalidadData = modalidades.find(
            (m) => m.modalidad === modalidad
          );
          // Verificar si modalidadData existe y tiene la propiedad id
          return modalidadData ? String(modalidadData.id) : null;
        })
        .filter((id) => id !== null); // Filtrar valores nulos si no se encontró la modalidad

      setSelectedModalidades(selectedModalidadesIds);
    } catch (error) {
      setNotificacion({
        message: "Error al editar el periodo",
        type: "error",
      });
    } finally {
      if (idTipoPeriodo) {
        setIdEvaluacion(
          evaluaciones.find((e) => e.evaluacion === item.evaluacion).id
        );
      }
      setIsLoading(false);
    }
  };

  const onSelectionEvaluacion = (id) => {
    setIdEvaluacion(id);
  };

  const onSelectionTipoPeriodo = (id) => {
    setIdTipoPeriodo(id);
  };

  const handleClear = () => {
    try {
      setIsLoading(true);
      setId("");
      setIdTipoPeriodo("");
      setIdEvaluacion("");
      setSelectedModalidades([]);
      setRangoFechas({
        start: parseDate("2025-01-01"),
        end: parseDate("2025-05-01"),
      });
      setDescripcion("");
      setSelectedPeriodo(null);
    } catch (error) {
      setNotificacion({
        message: "Error al limpiar los campos",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbrirPeriodo = async () => {
    try {
      setIsLoading(true);
      // Transformar selectedModalidades a la estructura requerida
      const modalidadesSeleccionadas = Array.from(selectedModalidades).map(
        // Array.from(selectedModalidades).map(
        (idModalidad) => ({
          idModalidad: parseInt(idModalidad, 10),
        })
      );

      const fechaI = new Date(
        rangoFechas.start.toDate(getLocalTimeZone()).toISOString().split("T")[0]
      );
      const fechaF = new Date(
        rangoFechas.end.toDate(getLocalTimeZone()).toISOString().split("T")[0]
      );

      const body = {
        idEvaluacionPertenece: idEvaluacion,
        fechaInicio: fechaI,
        fechaFin: fechaF,
        descripcion: descripcion,
        modalidades: JSON.stringify(modalidadesSeleccionadas),
      };

      // Verifica si el `id` existe y, si es así, lo agrega al body
      if (id) {
        body.id = id;
      }

      const response = await fetch("/api/periodo", {
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
          message: data.message || "Periodo guardado exitosamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message: data.message || "Ocurrió un error al guardar el periodo",
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
            classNames={{
              base: "border border-transparent dark:text-white",
            }}
          >
            {item[columnKey]}
          </Chip>
        );
      case "acciones":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar periodo">
              <span
                onClick={() => handleEditClick(item)}
                className="text-lg text-blue-900 cursor-pointer active:opacity-50"
              >
                <PencilSquareIcon className="h-6 w-6" />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Cerrar periodo">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <LockClosedIcon className="h-6 w-6" />
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
            Periodos Académicos
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Gestión de los periodos académicos.
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
                          defaultSelectedKey={String(idTipoPeriodo)}
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
                          defaultSelectedKey={String(idEvaluacion)}
                          startContent={
                            <ClipboardDocumentListIcon className="text-blue-900 dark:text-white h-6 w-6 " />
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
                          defaultSelectedKeys={selectedModalidades}
                          startContent={
                            <AdjustmentsVerticalIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
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

                        <DateRangePicker
                          label={
                            <label className="text-blue-900 dark:text-white">
                              Periodo académico
                            </label>
                          }
                          vocab="es"
                          variant="bordered"
                          visibleMonths={2}
                          startContent={
                            <CalendarDateRangeIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                          }
                          value={rangoFechas}
                          onChange={setRangoFechas}
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
                          value={descripcion}
                          onValueChange={setDescripcion}
                          maxRows={3}
                          classNames={{
                            base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black dark:text-white",
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
                            if (
                              idEvaluacion &&
                              (selectedModalidades.length > 0 || selectedModalidades.size > 0) &&
                              descripcion &&
                              rangoFechas
                            ) {
                              handleAbrirPeriodo();
                              onClose();
                            } else {
                              setNotificacion({
                                message:
                                  "Complete todos los campos para continuar",
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
            Total: {filteredItems.length} periodos
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
                <TableCell className="text-center capitalize">{item.periodo}</TableCell>
                <TableCell className="text-center capitalize">{item.tipoPeriodo}</TableCell>
                <TableCell className="text-center capitalize">{item.evaluacion}</TableCell>
                <TableCell className="text-center capitalize">{renderCell(item, "modalidades")}</TableCell>
                <TableCell className="text-center capitalize">{item.fechaInicio}</TableCell>
                <TableCell className="text-center capitalize">{item.fechaFin}</TableCell>
                <TableCell className="text-center capitalize">{item.descripcion}</TableCell>
                <TableCell>{renderCell(item, "estado")}</TableCell>
                <TableCell>{renderCell(item, "acciones")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableBody
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
          </TableBody> */}
        </Table>
      )}
    </div>
  );
}

export default Periodo;
