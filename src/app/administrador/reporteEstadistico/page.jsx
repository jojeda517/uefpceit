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

function ReporteEstadistico() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [periodos, setPeriodos] = useState([]); // Estado de los periodos
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(""); // Estado del periodo seleccionado
  const [campus, setCampus] = useState([]); // Estado de los campus
  const [campusSeleccionado, setCampusSeleccionado] = useState(""); // Estado del campus seleccionado

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

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Reporte
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Reporte de estadístico de estudiantes.
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

            <div className="grid grid-cols-3  w-full justify-items-center items-end">
              <Tooltip
                color="danger"
                content="Eliminar filtros"
                className="capitalize"
              >
                <Button isIconOnly color="danger" aria-label="Eliminar filtros">
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

export default ReporteEstadistico;
