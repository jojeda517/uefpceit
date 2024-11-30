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
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [reporte, setReporte] = useState([]); // Estado del reporte

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

  const handleGenerateReport = async () => {
    if (
      !campusSeleccionado ||
      !periodoSeleccionado ||
      !especialidadSeleccionada ||
      !nivelSeleccionado ||
      !paraleloSeleccionado
    ) {
      setNotificacion({
        message: "Por favor, seleccione todos los filtros.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/reportes/paseAnio/${campusSeleccionado}/${periodoSeleccionado}/${especialidadSeleccionada}/${nivelSeleccionado}/${paraleloSeleccionado}`
      );

      if (!res.ok) throw new Error("Error al generar el reporte");

      const data = await res.json();
      setReporte(data); // Guardar el reporte
      setNotificacion({
        message: "Reporte generado exitosamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      setNotificacion({
        message: "Error al generar el reporte.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPDF = () => {
    if (!reporte.length) {
      setNotificacion({
        message: "No hay datos para generar el PDF.",
        type: "error",
      });
      return;
    }

    const doc = new jsPDF("portrait"); // Cambiado a orientación vertical

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    let headerY = 15; // Coordenada inicial Y para el texto

    // Logos
    const logoLeft = "/logo.png";
    const logoRight = "/logoEcuador.png";
    const logoWidth = 15;
    const logoHeight = 15;

    doc.addImage(logoLeft, "PNG", 10, 10, logoWidth, logoHeight);
    doc.addImage(logoRight, "PNG", pageWidth - 25, 10, logoWidth, logoHeight);

    // Encabezado
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text("UNIDAD EDUCATIVA PCEI TUNGURAHUA", centerX, headerY, {
      align: "center",
    });

    headerY += 6;
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text("REPORTE DE PASES DE AÑO", centerX, headerY, { align: "center" });

    headerY += 5;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `PERIODO LECTIVO ${periodos
        .find((p) => p.id === parseInt(periodoSeleccionado))
        ?.nombre.toUpperCase()}`,
      centerX,
      headerY,
      { align: "center" }
    );

    headerY += 15;
    doc.text(
      `CAMPUS: ${campus
        .find((c) => c.id === parseInt(campusSeleccionado))
        ?.nombre.toUpperCase()}`,
      15,
      headerY
    );

    headerY += 7;
    doc.text(
      `ESPECIALIDAD: ${especialidades
        .find((e) => e.id === parseInt(especialidadSeleccionada))
        ?.especialidad.toUpperCase()}`,
      15,
      headerY
    );

    headerY += 7;
    doc.text(
      `NIVEL: ${niveles
        .find((n) => n.id === parseInt(nivelSeleccionado))
        ?.nivel.toUpperCase()}`,
      15,
      headerY
    );

    headerY += 7;
    doc.text(
      `PARALELO: ${paralelos
        .find((p) => p.PARALELO.id === parseInt(paraleloSeleccionado))
        ?.PARALELO.paralelo.toUpperCase()}`,
      15,
      headerY
    );

    // Tabla
    const encabezados = [
      ["Estudiante", "Promedio General", "Conducta", "Estado"],
    ];
    const filas = reporte.map((item) => [
      item.estudiante,
      item.promedioGeneral,
      item.conducta,
      item.estado,
    ]);

    headerY += 10;
    doc.autoTable({
      startY: headerY,
      head: encabezados,
      body: filas,
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], halign: "center" },
      bodyStyles: { fontSize: 9, halign: "center" },
      columnStyles: { 0: { halign: "left" } },
    });

    // Guardar el PDF
    doc.save("reporte_pases_anio.pdf");
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
                <Button
                  isIconOnly
                  color="success"
                  aria-label="Generar reporte"
                  onClick={handleGenerateReport}
                >
                  <BoltIcon className="text-white h-6 w-6" />
                </Button>
              </Tooltip>

              <Tooltip
                color="primary"
                content="Descargar reportes"
                className="capitalize"
              >
                <Button
                  isIconOnly
                  color="primary"
                  aria-label="Descargar"
                  onClick={handleDownloadPDF}
                >
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
