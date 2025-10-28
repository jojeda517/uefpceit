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
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { saveAs } from "file-saver";

function ReporteLibretaCurso() {
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
        `/api/reportes/reporteLibretaCurso/${campusSeleccionado}/${periodoSeleccionado}/${especialidadSeleccionada}/${nivelSeleccionado}/${paraleloSeleccionado}`
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
        const doc = new jsPDF("landscape"); // Cambiar a orientación horizontal

        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        reporte.forEach((item, index) => {
          if (index > 0) {
            doc.addPage(); // Nueva página para cada estudiante
          }

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
          doc.text("LIBRETA DE CALIFICACIONES", centerX, headerY, {
            align: "center",
          });

          headerY += 5;
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `PERIODO LECTIVO: ${periodos
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
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `Estudiante: ${item.estudiante} - Cédula: ${item.cedula}`,
            15,
            headerY
          );

          // Determinar dinámicamente el número máximo de parciales
          const maxParciales = Math.max(
            ...item.materias.map((materia) => materia.parciales.length)
          );

          // Generar encabezados dinámicos
          const columnasBase = [{ title: "Asignatura", dataKey: "materia" }];

          for (let i = 1; i <= maxParciales; i++) {
            columnasBase.push(
              { title: `${i} N1`, dataKey: `${i}_N1` },
              { title: `${i} N2`, dataKey: `${i}_N2` },
              { title: `${i} N3`, dataKey: `${i}_N3` },
              { title: `${i} E`, dataKey: `${i}_E` },
              { title: `${i} P`, dataKey: `${i}_P` },
              { title: `${i} C.`, dataKey: `${i}_Conducta` },
              { title: `${i} A.`, dataKey: `${i}_Asistencia` }
            );
          }

          columnasBase.push(
            { title: "PC", dataKey: "promConducta" },
            { title: "PA", dataKey: "promAsistencia" },
            { title: "T", dataKey: "total" }
          );

          // Crear filas de datos
          const filas = item.materias.map((materia) => {
            const fila = { materia: materia.materia };

            materia.parciales.forEach((parcial, index) => {
              const parcialIndex = index + 1;

              fila[`${parcialIndex}_N1`] =
                parcial.aportes[0] !== undefined ? parcial.aportes[0] : "-";
              fila[`${parcialIndex}_N2`] =
                parcial.aportes[1] !== undefined ? parcial.aportes[1] : "-";
              fila[`${parcialIndex}_N3`] =
                parcial.aportes[2] !== undefined ? parcial.aportes[2] : "-";
              fila[`${parcialIndex}_E`] =
                parcial.examen !== undefined ? parcial.examen : "-";
              fila[`${parcialIndex}_P`] =
                parcial.promedio !== undefined ? parcial.promedio : "-";
              fila[`${parcialIndex}_Conducta`] =
                parcial.conducta !== undefined ? parcial.conducta : "-";
              fila[`${parcialIndex}_Asistencia`] =
                parcial.asistencia !== undefined ? parcial.asistencia : "-";
            });

            fila.promConducta = materia.promedioConducta || "-";
            fila.promAsistencia = materia.promedioAsistencia || "-";
            fila.total = materia.promedioGeneral || "-";

            return fila;
          });

          headerY += 10;

          doc.autoTable({
            startY: headerY,
            columns: columnasBase,
            body: filas,
            theme: "grid",
            headStyles: { fillColor: [0, 102, 204], halign: "center" },
            bodyStyles: { fontSize: 9, halign: "center" },
          });
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
      link.download = "reporte_libreta_de_calificaciones.pdf";
      link.click();
    }

    // Generar CSV
    const csvContent = generateCSV(reporte);
    const bom = "\uFEFF"; // Byte Order Mark
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "reporte_libreta_de_calificaciones.csv");
  };

  const generateCSV = (data) => {
    const encabezadosBase = ["Estudiante", "Cédula", "Asignatura"];
    const maxParciales = Math.max(
      ...data.flatMap((estudiante) =>
        estudiante.materias.map((materia) => materia.parciales.length)
      )
    );
  
    // Generar encabezados dinámicos para los parciales
    const encabezadosParciales = [];
    for (let i = 1; i <= maxParciales; i++) {
      encabezadosParciales.push(
        `Parcial ${i} N1`,
        `Parcial ${i} N2`,
        `Parcial ${i} N3`,
        `Parcial ${i} Examen`,
        `Parcial ${i} Conducta`,
        `Parcial ${i} Asistencia`,
        `Parcial ${i} Promedio`
      );
    }
  
    const encabezadosFinales = [
      ...encabezadosBase,
      ...encabezadosParciales,
      "Promedio General",
      "Promedio Conducta",
      "Promedio Asistencia",
    ];
  
    // Crear las filas de datos
    const filas = data.flatMap((estudiante) =>
      estudiante.materias.map((materia) => {
        const filaBase = [
          estudiante.estudiante,
          estudiante.cedula,
          materia.materia,
        ];
  
        // Generar datos para cada parcial
        const datosParciales = [];
        for (let i = 0; i < maxParciales; i++) {
          const parcial = materia.parciales[i] || {};
          datosParciales.push(
            parcial.aportes?.[0] || "-",
            parcial.aportes?.[1] || "-",
            parcial.aportes?.[2] || "-",
            parcial.examen || "-",
            parcial.conducta || "-",
            parcial.asistencia || "-",
            parcial.promedio || "-"
          );
        }
  
        return [
          ...filaBase,
          ...datosParciales,
          materia.promedioGeneral,
          materia.promedioConducta,
          materia.promedioAsistencia,
        ].join(";");
      })
    );
  
    // Unir encabezados y filas
    const csvContenido = [encabezadosFinales.join(";"), ...filas].join("\n");
  
    return csvContenido;
  };  

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Reporte
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Libretas de caificaciones de un curso.
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
                  disabled={!paraleloSeleccionado}
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

export default ReporteLibretaCurso;
