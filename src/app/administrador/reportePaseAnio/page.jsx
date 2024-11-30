"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  Select,
  CardBody,
  Tooltip,
  SelectItem,
  Button,
} from "@nextui-org/react";
import {
  DocumentCheckIcon,
  BuildingOffice2Icon,
  InboxIcon,
  PuzzlePieceIcon,
  BarsArrowUpIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import {
  ArchiveBoxXMarkIcon,
  BoltIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "@/app/components/CircularProgress";
import Notification from "@/app/components/Notification";

function ReportePaseAnio() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [periodos, setPeriodos] = useState([]); // Estado de los periodos
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(""); // Estado del periodo seleccionado
  const [campus, setCampus] = useState([]); // Estado de los campus
  const [campusSeleccionado, setCampusSeleccionado] = useState(""); // Estado del campus seleccionado
  const [especialidades, setEspecialidades] = useState([]); // Estado de las especialidades
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(""); // Estado de la especialidad seleccionada
  const [niveles, setNiveles] = useState([]); // Estado de los niveles
  const [nivelSeleccionado, setNivelSeleccionado] = useState(""); // Estado del nivel seleccionado
  const [paralelos, setParalelos] = useState([]); // Estado de los paralelos
  const [paraleloSeleccionado, setParaleloSeleccionado] = useState(""); // Estado del paralelo seleccionado
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [campusRes, periodosRes] = await Promise.all([
        fetch("/api/campus"),
        fetch("/api/periodo"),
      ]);

      const [campusData, periodosData] = await Promise.all([
        campusRes.json(),
        periodosRes.json(),
      ]);

      setCampus(campusData);
      setPeriodos(periodosData);
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
    if (!campusSeleccionado) {
      setEspecialidadSeleccionada("");
      setEspecialidades([]);
      return;
    } // No hacer nada si no hay campus seleccionado

    const fetchEspecialidades = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/especialidad/campus/${campusSeleccionado}`
        );
        const data = await res.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error fetching especialidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEspecialidades();
  }, [campusSeleccionado]);

  useEffect(() => {
    if (!especialidadSeleccionada) {
      setNivelSeleccionado("");
      setNiveles([]);
      return;
    } // No hacer nada si no hay especialidad seleccionada

    const fetchNiveles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/nivel/especialidad/${especialidadSeleccionada}`
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
  }, [especialidadSeleccionada]);

  useEffect(() => {
    if (!nivelSeleccionado) {
      setParaleloSeleccionado("");
      setParalelos([]);
      return;
    } // No hacer nada si no hay nivel seleccionado

    const fetchParalelos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/paralelo/${nivelSeleccionado}/${especialidadSeleccionada}/${campusSeleccionado}`
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
  }, [campusSeleccionado, especialidadSeleccionada, nivelSeleccionado]);

  const handleClearFilters = () => {
    try {
      setIsLoading(true);
      setCampusSeleccionado("");
      setPeriodoSeleccionado("");
      setEspecialidadSeleccionada("");
      setEspecialidades([]);
      setNivelSeleccionado("");
      setNiveles([]);
      setParaleloSeleccionado("");
      setParalelos([]);
      setNotificacion({
        message: "Filtros eliminados correctamente",
        type: "success",
      });
    } catch (error) {
      console.error("Error clearing filters:", error);
      setNotificacion({
        message: "Error al eliminar los filtros",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Reporte
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Reporte de pases de año de los estudiantes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="font-semibold text-lg text-blue-900 dark:text-white bg-gray-100 dark:bg-gray-900">
            Filtros
          </CardHeader>

          <CardBody className="grid gap-x-10 gap-y-2 lg:grid-cols-3  dark:text-white bg-gray-100 dark:bg-gray-600">
            <Select
              id="campus"
              labelPlacement="outside"
              label={
                <label className="text-blue-900 dark:text-white">Campus</label>
              }
              startContent={
                <BuildingOffice2Icon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              placeholder="Seleccione el campus"
              selectedKeys={[campusSeleccionado]}
              onChange={(e) => setCampusSeleccionado(e.target.value)}
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                popoverContent:
                  "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                value: "text-black dark:text-white",
              }}
            >
              {campus.map((campus) => (
                <SelectItem key={campus.id} className="capitalize">
                  {campus?.nombre.toLowerCase()}
                </SelectItem>
              ))}
            </Select>

            <Select
              id="periodo"
              labelPlacement="outside"
              label={
                <label className="text-blue-900 dark:text-white">Periodo</label>
              }
              startContent={
                <InboxIcon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              placeholder="Seleccione el periodo"
              selectedKeys={[periodoSeleccionado]}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                popoverContent:
                  "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                value: "text-black dark:text-white",
              }}
            >
              {periodos.map((periodo) => (
                <SelectItem key={periodo.id} className="capitalize">
                  {periodo?.nombre.toLowerCase()}
                </SelectItem>
              ))}
            </Select>

            <Select
              id="especialidad"
              labelPlacement="outside"
              label={
                <label className="text-blue-900 dark:text-white">
                  Especialidad
                </label>
              }
              startContent={
                <PuzzlePieceIcon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              placeholder="Seleccione la especialidad"
              selectedKeys={[especialidadSeleccionada]}
              onChange={(e) => setEspecialidadSeleccionada(e.target.value)}
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                popoverContent:
                  "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                value: "text-black dark:text-white",
              }}
            >
              {especialidades.map((especialidad) => (
                <SelectItem key={especialidad.id} className="capitalize">
                  {especialidad?.especialidad.toLowerCase()}
                </SelectItem>
              ))}
            </Select>

            <Select
              id="nivel"
              labelPlacement="outside"
              label={
                <label className="text-blue-900 dark:text-white">Nivel</label>
              }
              startContent={
                <BarsArrowUpIcon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              placeholder="Seleccione el nivel"
              selectedKeys={[nivelSeleccionado]}
              onChange={(e) => setNivelSeleccionado(e.target.value)}
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                popoverContent:
                  "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                value: "text-black dark:text-white",
              }}
            >
              {niveles.map((nivel) => (
                <SelectItem key={nivel.id} className="capitalize">
                  {nivel?.nivel.toLowerCase()}
                </SelectItem>
              ))}
            </Select>

            <Select
              id="paralelo"
              labelPlacement="outside"
              label={
                <label className="text-blue-900 dark:text-white">
                  Paralelo
                </label>
              }
              startContent={
                <SquaresPlusIcon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              placeholder="Seleccione el paralelo"
              selectedKeys={[paraleloSeleccionado]}
              onChange={(e) => setParaleloSeleccionado(e.target.value)}
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                popoverContent:
                  "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                value: "text-black dark:text-white",
              }}
            >
              {paralelos.map((paralelo) => (
                <SelectItem key={paralelo?.PARALELO?.id} className="capitalize">
                  {paralelo?.PARALELO?.paralelo.toLowerCase()}
                </SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-3  w-full justify-items-center items-end">
              <Tooltip
                color="danger"
                content="Eliminar filtros"
                className="capitalize"
              >
                <Button
                  isIconOnly
                  color="danger"
                  aria-label="Eliminar filtros"
                  onClick={handleClearFilters}
                >
                  <ArchiveBoxXMarkIcon className="text-white h-6 w-6" />
                </Button>
              </Tooltip>

              <Tooltip
                color="success"
                content="Generar reporte"
                className="capitalize"
              >
                <Button isIconOnly color="success" aria-label="Generar reporte">
                  <BoltIcon className="text-white h-6 w-6" />
                </Button>
              </Tooltip>

              <Tooltip
                color="primary"
                content="Descargar reportes"
                className="capitalize"
              >
                <Button isIconOnly color="primary" aria-label="Descargar">
                  <ArrowDownTrayIcon className="text-white h-6 w-6 " />
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>

        <Card className="dark:bg-gray-700">
          <CardBody>Visor PDF</CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ReportePaseAnio;
