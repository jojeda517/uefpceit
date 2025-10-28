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
import { BuildingOffice2Icon, InboxIcon } from "@heroicons/react/24/solid";
import {
  ArchiveBoxXMarkIcon,
  BoltIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "@/app/components/CircularProgress";
import Notification from "@/app/components/Notification";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { saveAs } from "file-saver";

function ReporteEstadistico() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [periodos, setPeriodos] = useState([]); // Estado de los periodos
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(""); // Estado del periodo seleccionado
  const [campus, setCampus] = useState([]); // Estado de los campus
  const [campusSeleccionado, setCampusSeleccionado] = useState(""); // Estado del campus seleccionado
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [reporte, setReporte] = useState([]); // Estado del reporte
  const [pdfUrl, setPdfUrl] = useState(null); // Estado para almacenar la URL del PDF
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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

  const handleGenerateReport = async () => {
    if (!campusSeleccionado || !periodoSeleccionado) {
      setNotificacion({
        message: "Por favor, seleccione todos los filtros.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/reportes/estadistico/${campusSeleccionado}/${periodoSeleccionado}`
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

  useEffect(() => {
    if (reporte.length > 0) {
      const generatePDF = () => {
        const doc = new jsPDF("portrait");

        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;
        let headerY = 15;

        // Logos
        const logoLeft = "/logo.png";
        const logoRight = "/logoEcuador.png";
        const logoWidth = 15;
        const logoHeight = 15;

        doc.addImage(logoLeft, "PNG", 10, 10, logoWidth, logoHeight);
        doc.addImage(
          logoRight,
          "PNG",
          pageWidth - 25,
          10,
          logoWidth,
          logoHeight
        );

        // Encabezado
        doc.setFontSize(16);
        doc.setTextColor(0, 128, 0);
        doc.text("UNIDAD EDUCATIVA PCEI TUNGURAHUA", centerX, headerY, {
          align: "center",
        });

        headerY += 6;
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text("REPORTE ESTADÍSTICO", centerX, headerY, {
          align: "center",
        });

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

        // Tabla
        const encabezados = [["Curso", "Hombres", "Mujeres", "Otros", "Total"]];
        const filas = reporte.map((item) => [
          item.curso.toUpperCase(),
          item.masculinos,
          item.femeninos,
          item.otros,
          item.total,
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

        // Crear Blob y generar URL
        const pdfBlob = doc.output("blob");
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);

        setPdfUrl(pdfBlobUrl); // Actualiza el estado con la URL del PDF
      };

      generatePDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reporte]); // Ejecuta cada vez que 'reporte' cambie

  const downloadFiles = () => {
    if (!reporte.length) {
      setNotificacion({
        message: "No hay datos para descargar.",
        type: "error",
      });
      return;
    }

    // Reutilizar el PDF
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "reporte_estadistico.pdf";
      link.click();
    }

    // Generar CSV
    const csvContent = generateCSV(reporte);
    const bom = "\uFEFF"; // Byte Order Mark
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "reporte_pases_anio.csv");
  };

  const generateCSV = (data) => {
    const encabezados = ["Curso", "Hombres", "Mujeres", "Otros", "Total"];
    const filas = data.map(
      (item) =>
        `${item.curso};${item.masculinos};${item.femeninos};${item.otros};${item.total}`
    );

    return [encabezados.join(";"), ...filas].join("\n");
  };

  const handleClearFilters = () => {
    try {
      setIsLoading(true);
      setCampusSeleccionado("");
      setPeriodoSeleccionado("");
      setReporte([]);
      setPdfUrl(null);
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
                  disabled={!campusSeleccionado || !periodoSeleccionado}
                  aria-label="Generar reporte"
                  onClick={handleGenerateReport}
                  className="disabled:cursor-not-allowed"
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
                  disabled={reporte.length === 0}
                  aria-label="Descargar"
                  onClick={downloadFiles}
                  className="disabled:cursor-not-allowed"
                >
                  <ArrowDownTrayIcon className="text-white h-6 w-6 " />
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>

        <Card className="dark:bg-gray-700">
          <CardBody>
            {pdfUrl ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <div style={{ height: "750px" }}>
                  <Viewer
                    fileUrl={pdfUrl}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </div>
              </Worker>
            ) : (
              <p className="dark:text-white text-blue-900 text-center animate-pulse">
                Genera un reporte para visualizarlo.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ReporteEstadistico;
