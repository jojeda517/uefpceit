"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  Input,
  Autocomplete,
  AutocompleteItem,
  CardBody,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { IdentificationIcon } from "@heroicons/react/24/solid";
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

function RetiroCarpeta() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const [estudiantes, setEstudiantes] = useState([]);
  const [idEstudiante, setIdEstudiante] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);

  const [motivo, setMotivo] = useState("Voluntario");

  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [reporte, setReporte] = useState([]); // Estado del reporte
  const [pdfUrl, setPdfUrl] = useState(null); // Estado para almacenar la URL del PDF
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [estudiantesRes] = await Promise.all([
        fetch("/api/persona/estudiante"),
      ]);

      const [estudiantesData] = await Promise.all([estudiantesRes.json()]);

      setEstudiantes(estudiantesData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const onSelectionEstudiante = (id) => {
    setIdEstudiante(id);
    setSelectedEstudiante(id);
  };

  const handleClearFilters = () => {
    try {
      setIsLoading(true);
      setIdEstudiante("");
      setSelectedEstudiante(null);
      setMotivo("Voluntario");

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
    if (!idEstudiante || !motivo) {
      setNotificacion({
        message: "Por favor, seleccione todos los filtros.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/reportes/retiroCarpeta/${idEstudiante}/`);

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
    if (reporte && reporte.ESTUDIANTE) {
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
        doc.text("CERTIFICADO DE MATRICULA", centerX, headerY, {
          align: "center",
        });

        headerY += 5;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `PERIODO LECTIVO ${reporte.PERIODO.nombre}`,
          centerX,
          headerY,
          { align: "center" }
        );

        headerY += 15;
        doc.setFont(undefined, "bold");
        doc.text(`CIUDAD Y FECHA: `,
        15,
        headerY, {
          maxWidth: 180, // ajusta según el ancho que quieras (210mm es el total en A4, menos márgenes)
        });
        
        doc.setFont(undefined, "normal");
        doc.text(`CIUDAD Y FECHA: `,
        75,
        headerY, {
          maxWidth: 180, // ajusta según el ancho que quieras (210mm es el total en A4, menos márgenes)
        });

        /* headerY += 15;
        doc.text(
          `Ante el suscrito secretario de la Unidad Educativa PCEI Tungurahua, se presentó el señor(a): ${reporte.ESTUDIANTE.PERSONA.apellido} ${reporte.ESTUDIANTE.PERSONA.nombre}`,
          15,
          headerY,
          {
            maxWidth: 180, // ajusta según el ancho que quieras (210mm es el total en A4, menos márgenes)
          }
        );

        headerY += 15;
        const nacimiento = new Date(reporte.ESTUDIANTE.PERSONA.fechaNacimiento);
        const hoy = new Date();

        let years = hoy.getFullYear() - nacimiento.getFullYear();
        let months = hoy.getMonth() - nacimiento.getMonth();
        let days = hoy.getDate() - nacimiento.getDate();

        if (days < 0) {
          months -= 1;
          const prevMonth = new Date(hoy.getFullYear(), hoy.getMonth(), 0); // Último día del mes anterior
          days += prevMonth.getDate();
        }

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        doc.text(
          `De ${years} años, ${months} meses y ${days} días de edad, de nacionalidad ${reporte.ESTUDIANTE.PERSONA.nacionalidad?.toUpperCase()}, nacido(a) en ${reporte.ESTUDIANTE.lugarNacimiento?.toUpperCase()} el ${nacimiento.toLocaleDateString()}. Estado civil: ${reporte.ESTUDIANTE.ESTADO_CIVIL.estadoCivil?.toUpperCase()}, de profesión: ${reporte.ESTUDIANTE.nombreTrabajo?.toUpperCase()}. Domicilio: ${reporte.ESTUDIANTE.PERSONA.parroquia.CANTON.canton?.toUpperCase()}, teléfono: ${
            reporte.ESTUDIANTE.PERSONA.telefono
          }. Slicitó su matricula en el nivel: ${reporte.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel?.toUpperCase()} de la especialidad ${reporte.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad?.toUpperCase()}, paralelo "${reporte.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo?.toUpperCase()}". Se emite el presente certificado a solicitud del interesado para los fines que estime conveniente.`,
          15,
          headerY,
          {
            maxWidth: 180, // ajusta según el ancho que quieras (210mm es el total en A4, menos márgenes)
          }
        ); */

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
    if (!reporte && !reporte.ESTUDIANTE) {
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
      link.download = "Certificado_de_matricula.pdf";
      link.click();
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      <div id="fechaCertificado" style={{ display: "none" }}>
        <p>
          En Ambato a:{" "}
          {new Date().toLocaleDateString("es-EC", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      {isLoading && <CircularProgress />}
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      <div className="grid grid-cols-1 gap-2 pb-5">
        <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
          Retiro de carpeta
        </h2>
        <p className="font-light text-lg text-black dark:text-white">
          Certificado de retiro del estudiante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="font-semibold text-lg text-blue-900 dark:text-white bg-gray-100 dark:bg-gray-900">
            Filtros
          </CardHeader>

          <CardBody className="grid gap-x-10 gap-y-2 lg:grid-cols-3  dark:text-white bg-gray-100 dark:bg-gray-600">
            <Autocomplete
              label={
                <label className="text-blue-900 dark:text-white">
                  Cédula de identidad
                </label>
              }
              startContent={
                <IdentificationIcon className="text-blue-900 dark:text-white h-6 w-6 " />
              }
              variant="bordered"
              placeholder="Buscar estudiante"
              onSelectionChange={onSelectionEstudiante}
              defaultItems={estudiantes}
              inputProps={{
                className: "dark:text-white capitalize",
              }}
              defaultSelectedKey={String(idEstudiante)}
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-blue-500 focus:border-blue-900 dark:focus:border-black",

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
              {(e) => (
                <AutocompleteItem key={String(e.id)} className="capitalize">
                  {e.PERSONA.nombre + " " + e.PERSONA.apellido}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Input
              label={
                <label className="text-blue-900 dark:text-white">Motivo</label>
              }
              value={motivo}
              onValueChange={setMotivo}
              type="text"
              variant="bordered"
              classNames={{
                base: "border border-blue-900 dark:border-black rounded-xl focus-within:ring-1 focus-within:ring-blue-900 dark:focus-within:ring-blue-500 focus-within:border-blue-900 dark:focus-within:border-black",
                input: "dark:text-white capitalize",
              }}
            />

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
                  /* disabled={!paraleloSeleccionado} */
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

export default RetiroCarpeta;
