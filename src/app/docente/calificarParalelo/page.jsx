"use client";
import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

import {
  Card,
  CardHeader,
  Select,
  CardBody,
  CardFooter,
  SelectItem,
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableColumn,
  TableCell,
} from "@nextui-org/react";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import {
  PlusCircleIcon,
  MinusCircleIcon,
  DocumentTextIcon,
  PaperClipIcon,
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/solid";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";
import { encode } from "next-auth/jwt";

function CalificarParalelo() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [paraleloData, setParaleloData] = useState(null); // Datos del paralelo
  const [idPersona, setIdPersona] = useState(null);
  const [parciales, setParciales] = useState([]); // Parciales del paralelo
  const [parcialSeleccionado, setParcialSeleccionado] = useState("");
  const [calificacionesFiltradas, setCalificacionesFiltradas] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(1);
  const [etapaAnteriorCompleta, setEtapaAnteriorCompleta] = useState(true);
  const [calificacionesPublicadas, setCalificacionesPublicadas] =
    useState(false);
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [estudiantes, setEstudiantes] = useState([]);
  const [maxAportes, setMaxAportes] = useState(3);
  const [maxExamenes, setMaxExamenes] = useState(1);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  useEffect(() => {
    // Cargar datos de localStorage al montar el componente
    const storedNombre = localStorage.getItem("nombre");
    const storedApellido = localStorage.getItem("apellido");

    setNombre(storedNombre || "");
    setApellido(storedApellido || "");
  }, []);

  // Cargar datos iniciales de estudiantes y parciales una vez
  useEffect(() => {
    const storedParalelo = localStorage.getItem("selectedParalelo");
    if (storedParalelo) {
      const parsedParaleloData = JSON.parse(storedParalelo);
      setParaleloData(parsedParaleloData);

      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          const estudianteUrl = `/api/estudiantesParalelo/${localStorage.getItem(
            "idPersona"
          )}/${parsedParaleloData.PERIODO.id}/${
            parsedParaleloData.DETALLEMATERIA.MATERIA.id
          }/${
            parsedParaleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.id
          }/${
            parsedParaleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.id
          }/${
            parsedParaleloData.DETALLEMATERIA.DETALLENIVELPARALELO
              .CAMPUSESPECIALIDAD.CAMPUS.id
          }/${
            parsedParaleloData.DETALLEMATERIA.DETALLENIVELPARALELO
              .CAMPUSESPECIALIDAD.ESPECIALIDAD.id
          }`;

          const [estudiantesRes, parcialesRes] = await Promise.all([
            fetch(estudianteUrl),
            fetch(
              `/api/parcial/${parsedParaleloData.PERIODO.idEvaluacionPertenece}`
            ),
          ]);

          const [estudiantesData, parcialesData] = await Promise.all([
            estudiantesRes.json(),
            parcialesRes.json(),
          ]);

          // Agregar el "Supletorio" a la lista de parciales
          parcialesData.push({
            id: "supletorio", // Puedes usar un ID especial para el supletorio
            parcial: "Supletorio", // Nombre para mostrar en el select
            idEvaluacionPertenece:
              parsedParaleloData.PERIODO.idEvaluacionPertenece,
          });

          setEstudiantes(estudiantesData);
          setParciales(parcialesData);
          setParcialSeleccionado(String(parcialesData[0].id)); // Solo se setea al cargar inicialmente
        } catch (error) {
          console.error("Error fetching initial data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();
    }
  }, [idPersona]);

  useEffect(() => {
    console.log(estudiantes);
  }, [estudiantes]);

  useEffect(() => {
    if (parcialSeleccionado === "supletorio") {
      // Calcular el promedio de los parciales anteriores
      const nuevasCalificaciones = estudiantes.map((estudiante) => {
        const parcialesPrevios = estudiante.MATRICULA[0].CALIFICACION.filter(
          (calif) => calif.idParcial !== parcialSeleccionado
        );

        // Calcular el promedio de los aportes (70%) + examen (30%)
        const promedioParciales =
          parcialesPrevios.reduce((acc, calif) => {
            const sumaAportes = calif.APORTE.reduce(
              (total, aporte) => total + aporte.aporte,
              0
            );
            const promedioAportes = sumaAportes / calif.APORTE.length || 0;
            const examenNota = calif.EXAMEN[0]?.nota || 0; // Se asume que siempre hay un examen

            // Fórmula de promedio ponderado
            return acc + (promedioAportes * 0.7 + examenNota * 0.3);
          }, 0) / parcialesPrevios.length;

        // Determinar el estado del estudiante
        const estado =
          promedioParciales >= 7
            ? "Aprobado"
            : promedioParciales >= 5
            ? "Supletorio"
            : "Reprobado";

        return {
          ...estudiante,
          promedioParciales,
          estado,
          supletorioCalificacion: "", // Campo para la calificación del supletorio
        };
      });

      setCalificacionesFiltradas(nuevasCalificaciones);
    } else {
      const nuevasCalificaciones = estudiantes.map((estudiante) => {
        const matricula = estudiante.MATRICULA[0];
        const calificacion =
          matricula.CALIFICACION.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          ) || {};

        const aportes = calificacion.APORTE || [];
        const examenes = calificacion.EXAMEN || [];

        return {
          ...estudiante,
          calificacion,
          maxAportes: Math.max(aportes.length, 3), // Asegura mínimo de 3 aportes
          maxExamenes: Math.max(examenes.length, 1), // Asegura mínimo de 1 examen
        };
      });

      setCalificacionesFiltradas(nuevasCalificaciones);

      // Establece maxAportes y maxExamenes para este parcial específico
      const maxAportesTotal = Math.max(
        3,
        ...nuevasCalificaciones.map((estudiante) => estudiante.maxAportes)
      );
      const maxExamenesTotal = Math.max(
        1,
        ...nuevasCalificaciones.map((estudiante) => estudiante.maxExamenes)
      );

      setMaxAportes(maxAportesTotal);
      setMaxExamenes(maxExamenesTotal);
    }
  }, [parcialSeleccionado, estudiantes]);

  const handleCalificacionChange = (idEstudiante, tipo, index, valor) => {
    setCalificacionesFiltradas((prevCalificaciones) =>
      prevCalificaciones.map((estudiante) => {
        if (estudiante.id === idEstudiante) {
          const calificacionParcial = estudiante.MATRICULA[0].CALIFICACION.find(
            (calif) => String(calif.idParcial) === parcialSeleccionado
          );

          if (calificacionParcial) {
            // Actualiza el valor basado en el tipo
            if (tipo.startsWith("aporte")) {
              const aporteIndex = parseInt(tipo.replace("aporte", "")) - 1;
              if (!calificacionParcial.APORTE[aporteIndex]) {
                calificacionParcial.APORTE[aporteIndex] = { aporte: 0 };
              }
              calificacionParcial.APORTE[aporteIndex].aporte =
                parseFloat(valor) || 0;
            } else if (tipo === "examen") {
              if (!calificacionParcial.EXAMEN[0]) {
                calificacionParcial.EXAMEN[0] = { nota: 0 };
              }
              calificacionParcial.EXAMEN[0].nota = parseFloat(valor) || 0;
            } else if (tipo === "asistencia") {
              if (!calificacionParcial.ASISTENCIA[0]) {
                calificacionParcial.ASISTENCIA[0] = { porcentaje: 0 };
              }
              calificacionParcial.ASISTENCIA[0].porcentaje =
                parseFloat(valor) || 0;
            } else if (tipo === "conducta") {
              if (!calificacionParcial.CONDUCTA[0]) {
                calificacionParcial.CONDUCTA[0] = { puntaje: 0 };
              }
              calificacionParcial.CONDUCTA[0].puntaje = parseFloat(valor) || 0;
            }
          }
        }
        return estudiante;
      })
    );
  };

  const calcularPromedio = (aportes, examenes) => {
    if (aportes.length > 0 && examenes.length > 0) {
      const totalAportes = aportes.reduce(
        (acc, aporte) => acc + (aporte.aporte || 0),
        0
      );
      const totalExamen = examenes.reduce(
        (acc, examen) => acc + (examen.nota || 0),
        0
      );

      const promedioAportes = (totalAportes * 0.7) / maxAportes;
      const promedioExamen = totalExamen * 0.3;
      return (promedioAportes + promedioExamen).toFixed(2);
    }
    return "-";
  };

  const handleSubmitCalificaciones = async () => {
    try {
      setIsLoading(true);
      const calificacionesData = {
        idDetalleMateriaPertenece: paraleloData.DETALLEMATERIA.id,
        idPeriodoPertenece: paraleloData.PERIODO.id,
        idDocentePertenece: paraleloData.idDocentePertenece,
        idParcial: parcialSeleccionado,
        calificaciones: calificacionesFiltradas.map((estudiante) => {
          const aportes = estudiante.calificacion.APORTE || [];
          const examenes = estudiante.calificacion.EXAMEN || [];
          const asistencia = estudiante.calificacion.ASISTENCIA || [];
          const conducta = estudiante.calificacion.CONDUCTA || [];

          // Determina la cantidad de aportes necesaria
          const cantidadDeAportes = 3; // Número fijo de aportes

          // Maneja la nota del examen correctamente o establece 0 si no está definida
          const examenNota =
            examenes.length > 0 && examenes[0]?.nota !== undefined
              ? examenes[0].nota
              : 0;

          // Ajusta los aportes al número fijo de columnas, reemplazando valores faltantes con 0
          const aportesAjustados = Array(cantidadDeAportes)
            .fill(0)
            .map((_, index) => aportes[index]?.aporte || 0);

          // Ajusta asistencia y conducta, reemplazando valores faltantes con 0
          const asistenciaAjustada =
            asistencia.length > 0 && asistencia[0]?.valor !== undefined
              ? asistencia[0]?.valor
              : 0;

          const conductaAjustada =
            conducta.length > 0 && conducta[0]?.valor !== undefined
              ? conducta[0]?.valor
              : 0;

          // Calcula el promedio de los aportes
          const promedioAportes =
            aportesAjustados.reduce((sum, val) => sum + val, 0) /
            cantidadDeAportes;

          // Calcula el promedio final (ponderado)
          const promedio = parseFloat(
            (promedioAportes * 0.7 + examenNota * 0.3).toFixed(2)
          );

          return {
            idEstudiante: estudiante.id,
            aportes: aportesAjustados,
            examenes: examenNota,
            asistencia: asistenciaAjustada,
            conducta: conductaAjustada,
            promedio, // Incluye el promedio calculado
          };
        }),
      };

      const response = await fetch("/api/calificarCurso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calificacionesData),
      });

      const data = await response.json();
      if (response.ok) {
        setNotificacion({
          message: response.message || "Calificaciones guardadas correctamente",
          type: "success",
        });
      } else {
        setNotificacion({
          message: response.message || "Error al guardar las calificaciones",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setNotificacion({
        message: "Error en la solicitud, intente nuevamente.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generarCSV = () => {
    try {
      setIsLoading(true);
      // Columnas del archivo CSV
      const encabezados = [
        "Cedula",
        "Nombre Completo",
        "Aporte 1",
        "Aporte 2",
        "Aporte 3",
        "Examen",
        "Asistencia",
        "Conducta",
      ];

      // Datos de los estudiantes formateados
      const filas = estudiantes.map((estudiante) => [
        estudiante.PERSONA.cedula,
        `${estudiante.PERSONA.apellido} ${estudiante.PERSONA.nombre}`,
        "", // Aporte 1 vacío
        "", // Aporte 2 vacío
        "", // Aporte 3 vacío
        "", // Asistencia
        "", // Conducta
        "", // Examen vacío
      ]);

      // Combina encabezados y filas
      const csvContent = [encabezados, ...filas]
        .map((e) => e.join(";"))
        .join("\n");

      // Crear un blob y descargarlo
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      // Crear un enlace para iniciar la descarga
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla_calificaciones.csv";
      a.click();

      // Liberar la URL creada
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el archivo CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    try {
      setIsLoading(true);
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;

        // Parsear el contenido CSV
        Papa.parse(content, {
          header: true,
          delimiter: ";", // Asegúrate de que coincida con tu delimitador
          complete: (result) => {
            const parsedData = result.data;

            // Función para validar y formatear la calificación
            const validateCalificacion = (value, max = 10) => {
              const normalizedValue = value?.replace(",", ".") || "0";
              const num = parseFloat(normalizedValue);
              if (isNaN(num)) return 0;
              if (num < 0) return 0;
              if (num > max) return max;
              return Math.round(num * 100) / 100;
            };

            // Procesa el CSV y actualiza calificacionesFiltradas
            const updatedCalificaciones = calificacionesFiltradas.map(
              (estudiante) => {
                const estudianteData = parsedData.find(
                  (row) => row.Cedula === estudiante.PERSONA.cedula
                );

                if (estudianteData) {
                  // Encuentra la calificación para el parcial seleccionado
                  const calificacionParcial =
                    estudiante.MATRICULA[0].CALIFICACION.find(
                      (calif) => String(calif.idParcial) === parcialSeleccionado
                    );

                  if (calificacionParcial) {
                    // Actualiza o crea las propiedades necesarias
                    calificacionParcial.APORTE = [
                      {
                        aporte: validateCalificacion(
                          estudianteData["Aporte 1"]
                        ),
                      },
                      {
                        aporte: validateCalificacion(
                          estudianteData["Aporte 2"]
                        ),
                      },
                      {
                        aporte: validateCalificacion(
                          estudianteData["Aporte 3"]
                        ),
                      },
                    ];

                    calificacionParcial.EXAMEN = [
                      {
                        nota: validateCalificacion(estudianteData["Examen"]),
                      },
                    ];

                    calificacionParcial.ASISTENCIA = [
                      {
                        porcentaje: validateCalificacion(
                          estudianteData["Asistencia"],
                          100
                        ),
                      },
                    ];

                    calificacionParcial.CONDUCTA = [
                      {
                        puntaje: validateCalificacion(
                          estudianteData["Conducta"]
                        ),
                      },
                    ];
                  }
                }

                return estudiante;
              }
            );

            // Actualizar el estado
            setCalificacionesFiltradas(updatedCalificaciones);
          },
          error: (error) => console.error("Error al parsear el CSV:", error),
        });
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error al cargar el archivo CSV:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isParcialCerrado = () => {
    if (parcialSeleccionado === "supletorio") return false;
    const parcial = parciales.find((p) => String(p.id) === parcialSeleccionado);
    return !parcial?.CIERREFASE[0]?.estado || false; // Retorna false si no hay información del estado
  };

  const parcialCerrado = isParcialCerrado();

  const calcularPromedioSupletorio = (calificacionesParciales) => {
    const totalParciales = parciales.length - 1; // Total de parciales existentes menos el supletorio
    const sumaNotas = parciales.reduce((suma, parcial) => {
      const calificacion = calificacionesParciales.find(
        (c) => c.idParcial === parcial.id
      );
      return suma + (calificacion?.promedio || 0);
    }, 0);
    return (sumaNotas / totalParciales).toFixed(2); // Redondeado a 2 decimales
  };

  const handleSupletorioChange = (idEstudiante, valor) => {
    const nota = parseFloat(valor);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      return; // Si la nota no es válida, no hace nada
    }

    setCalificacionesFiltradas((prevCalificaciones) =>
      prevCalificaciones.map((estudiante) => {
        if (estudiante.id === idEstudiante) {
          if (estudiante.MATRICULA[0]?.SUPLETORIO) {
            estudiante.MATRICULA[0].SUPLETORIO.nota = nota;
          } else {
            estudiante.MATRICULA[0].SUPLETORIO = {
              nota: nota,
              fecha: new Date().toISOString(),
            };
          }
        }
        return estudiante;
      })
    );
  };

  const descargarCalificaciones = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/estudiantesParalelo/${localStorage.getItem("idPersona")}/${
          paraleloData.PERIODO.id
        }/${paraleloData.DETALLEMATERIA.MATERIA.id}/${
          paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.id
        }/${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.id}/${
          paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
            .CAMPUS.id
        }/${
          paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
            .ESPECIALIDAD.id
        }`
      );

      const estudiantesActualizados = await response.json();

      if (parcialSeleccionado.toLowerCase() === "supletorio") {
        const parcialesSinSupletorio = parciales.filter(
          (parcial) => parcial.parcial.toLowerCase() !== "supletorio"
        );

        const encabezados = [
          [
            { content: "Estudiante", rowSpan: 2 },
            ...parcialesSinSupletorio.map((parcial) => ({
              content: parcial.parcial.toUpperCase(),
              colSpan: 6,
            })),
            { content: "General", colSpan: 4 }, // Promedio, Supletorio, Total, Estado
          ],
          [
            ...parcialesSinSupletorio.flatMap(() => [
              "A1",
              "A2",
              "A3",
              "Examen",
              "Asis.",
              "Prom.",
            ]),
            "Promedio",
            "Supletorio",
            "Total",
            "Estado",
          ],
        ];

        const filas = estudiantesActualizados.map((estudiante) => {
          const calificaciones = estudiante.MATRICULA[0]?.CALIFICACION || [];
          const supletorioNota =
            estudiante.MATRICULA[0]?.SUPLETORIO?.nota !== undefined
              ? estudiante.MATRICULA[0]?.SUPLETORIO?.nota
              : null;

          let totalPromedios = 0;
          let totalParciales = 0;

          const fila = [
            `${estudiante.PERSONA.apellido.toUpperCase()} ${estudiante.PERSONA.nombre.toUpperCase()}`,
            ...parcialesSinSupletorio.flatMap((parcial) => {
              const calificacion =
                calificaciones.find((c) => c.idParcial === parcial.id) || {};

              const promedioParcial = calificacion.promedio || 0;
              totalPromedios += promedioParcial;
              totalParciales += 1;

              return [
                calificacion?.APORTE?.[0]?.aporte || 0,
                calificacion?.APORTE?.[1]?.aporte || 0,
                calificacion?.APORTE?.[2]?.aporte || 0,
                calificacion?.EXAMEN?.[0]?.nota || 0,
                calificacion?.ASISTENCIA?.[0]?.porcentaje || 0,
                promedioParcial.toFixed(2),
              ];
            }),
          ];

          // Calcular promedio entre parciales
          const promedioParciales =
            totalParciales > 0
              ? (totalPromedios / totalParciales).toFixed(2)
              : 0;

          // Determinar si aplica al supletorio
          const aplicaSupletorio =
            promedioParciales >= 4 && promedioParciales < 7;

          const supletorio = aplicaSupletorio
            ? supletorioNota !== null
              ? supletorioNota
              : 0
            : "-";

          // Calcular promedio final
          const promedioFinal =
            aplicaSupletorio && supletorio !== "-"
              ? (
                  (parseFloat(promedioParciales) + parseFloat(supletorio)) /
                  2
                ).toFixed(2)
              : promedioParciales;

          // Determinar estado
          const estado =
            promedioFinal >= 7
              ? "Aprobado"
              : promedioFinal >= 5
              ? "Supletorio"
              : "Reprobado";

          return [
            ...fila,
            promedioParciales, // Promedio de parciales
            supletorio, // Nota supletorio
            promedioFinal, // Total
            estado, // Estado
          ];
        });

        const jsPDF = (await import("jspdf")).default;
        require("jspdf-autotable");

        const doc = new jsPDF("landscape");

        const pageWidth = doc.internal.pageSize.getWidth();

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

        const centerX = pageWidth / 2;
        let headerY = 15;

        doc.setFontSize(16);
        doc.setTextColor(0, 128, 0);
        doc.text("UNIDAD EDUCATIVA PCEI TUNGURAHUA", centerX, headerY, {
          align: "center",
        });

        headerY += 6;
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text("INFORME GENERAL DE CALIFICACIONES", centerX, headerY, {
          align: "center",
        });

        headerY += 5;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `PERIODO LECTIVO ${paraleloData.PERIODO.nombre.toUpperCase()}`,
          centerX,
          headerY,
          { align: "center" }
        );

        headerY += 10;
        doc.text(
          `NIVEL: ${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel.toUpperCase()}`,
          20,
          headerY
        );
        headerY += 7;
        doc.text(
          `ASIGNATURA: ${paraleloData.DETALLEMATERIA.MATERIA.nombre.toUpperCase()}`,
          20,
          headerY
        );
        headerY += 7;
        doc.text(
          `PARALELO: "${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo.toUpperCase()}"`,
          20,
          headerY
        );
        headerY += 7;
        doc.text(
          `DOCENTE: ${nombre.toUpperCase()} ${apellido.toUpperCase()}`,
          20,
          headerY
        );

        doc.autoTable({
          startY: headerY + 10,
          head: encabezados,
          body: filas,
          theme: "grid",
          headStyles: { fillColor: [0, 102, 204], halign: "center" },
          bodyStyles: { fontSize: 9, halign: "center" },
          columnStyles: { 0: { halign: "left" } },
        });

        doc.save("reporte_general_calificaciones.pdf");
      } else {
        const encabezados = [
          "Estudiante",
          "Ap. 1",
          "Ap. 2",
          "Ap. 3",
          "Examen",
          "Asistencia",
          "Conducta",
          "Promedio",
        ];

        const filas = estudiantesActualizados.map((estudiante) => [
          `${estudiante.PERSONA.apellido.toUpperCase()} ${estudiante.PERSONA.nombre.toUpperCase()}`,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.APORTE[0]?.aporte || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.APORTE[1]?.aporte || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.APORTE[2]?.aporte || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.EXAMEN[0]?.nota || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.ASISTENCIA[0]?.porcentaje || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.CONDUCTA[0]?.puntaje || 0,
          estudiante?.MATRICULA[0]?.CALIFICACION?.find(
            (calif) => calif.idParcial === parseInt(parcialSeleccionado)
          )?.promedio || 0,
        ]);

        const promedioCurso =
          filas.reduce((acc, fila) => acc + parseFloat(fila[7]), 0) /
          filas.length;

        // Crear PDF con orientación vertical
        const jsPDF = (await import("jspdf")).default;
        require("jspdf-autotable");

        const doc = new jsPDF("portrait"); // Cambiamos a 'portrait' para orientación vertical

        const pageWidth = doc.internal.pageSize.getWidth();

        // Agregar el logo izquierdo
        const logoLeft = "/logo.png";
        const logoRight = "/logoEcuador.png";
        const logoWidth = 15;
        const logoHeight = 15;

        doc.addImage(logoLeft, "PNG", 10, 10, logoWidth, logoHeight);

        // Agregar el logo derecho
        doc.addImage(
          logoRight,
          "PNG",
          pageWidth - 25,
          10,
          logoWidth,
          logoHeight
        );

        // Agregar el texto del encabezado con líneas compactas
        const centerX = pageWidth / 2;
        let headerY = 15; // Coordenada inicial Y para el texto

        doc.setFontSize(16);
        doc.setTextColor(0, 128, 0);
        doc.text("UNIDAD EDUCATIVA PCEI TUNGURAHUA", centerX, headerY, {
          align: "center",
        });

        headerY += 6; // Reducir el espacio entre líneas
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text(
          `INFORME DE CALIFICACIONES ${parciales
            .find((p) => p.id === parseInt(parcialSeleccionado))
            .parcial.toUpperCase()}`,
          centerX,
          headerY,
          {
            align: "center",
          }
        );

        headerY += 5; // Reducir aún más el espacio
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(
          `PERIODO LECTIVO ${paraleloData.PERIODO.nombre.toUpperCase()}`,
          centerX,
          headerY,
          {
            align: "center",
          }
        );

        // Después del encabezado y antes de la tabla
        headerY += 10; // Espacio después del último texto del encabezado
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Negro

        doc.text(
          `NIVEL: ${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel.toUpperCase()}`,
          20,
          headerY
        );
        headerY += 7; // Espacio entre líneas
        doc.text(
          `ASIGNATURA: ${paraleloData.DETALLEMATERIA.MATERIA.nombre.toUpperCase()}`,
          20,
          headerY
        );
        headerY += 7; // Espacio entre líneas
        doc.text(
          `PARALELO: "${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo.toUpperCase()}"`,
          20,
          headerY
        );
        headerY += 7; // Más espacio
        doc.text(
          `DOCENTE: ${nombre.toUpperCase()} ${apellido.toUpperCase()}`,
          20,
          headerY
        );

        // Agregar la tabla al PDF
        doc.autoTable({
          startY: headerY + 10,
          head: [encabezados],
          body: filas,
          foot: [
            [
              "Promedio General",
              "",
              "",
              "",
              "",
              "",
              "",
              promedioCurso.toFixed(2),
            ],
          ],
          theme: "grid",
          headStyles: {
            fillColor: [0, 102, 204],
            fontSize: 9,
            halign: "center",
          },
          bodyStyles: { fontSize: 9 },
          footStyles: {
            fillColor: [0, 102, 204],
            fontSize: 9,
            halign: "center",
          }, // centrar el texto
          columnStyles: {
            1: { halign: "center" }, // Centrar Aporte 1
            2: { halign: "center" }, // Centrar Aporte 2
            3: { halign: "center" }, // Centrar Aporte 3
            4: { halign: "center" }, // Centrar Examen
            5: { halign: "center" }, // Centrar Asistencia
            6: { halign: "center" }, // Centrar Conducta
            7: { halign: "center" }, // Centrar Promedio
          },
        });

        // Descargar PDF
        doc.save("calificaciones.pdf");
      }
    } catch (error) {
      console.error("Error al descargar las calificaciones:", error);
      setNotificacion({
        message: "Error al descargar las calificaciones.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="container mx-auto px-4 py-8"> *
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <Notification
        message={notificacion.message}
        type={notificacion.type}
        onClose={() => setNotificacion({ message: "", type: "" })}
      />
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Calificaciones
          </h2>
          {paraleloData ? (
            <p className="font-light text-lg text-black dark:text-white">
              Registro de calificaciones en{" "}
              <strong>
                {paraleloData.DETALLEMATERIA.MATERIA.nombre.toUpperCase()}
              </strong>{" "}
              para{" "}
              <strong>
                {paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel.toUpperCase()}
              </strong>
              , Paralelo{" "}
              <strong>
                {paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo.toUpperCase()}
              </strong>
              , Campus{" "}
              <strong>
                {paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.CAMPUS.nombre.toUpperCase()}
              </strong>
              .
            </p>
          ) : (
            <p className="font-light text-lg text-black dark:text-white animate-pulse">
              Cargando...
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="">
          <CardHeader className="font-semibold text-lg text-blue-900 dark:text-white bg-gray-100 dark:bg-gray-900">
            Configuración
          </CardHeader>
          <CardBody className="grid gap-10 lg:grid-cols-3 dark:text-white bg-gray-100 dark:bg-gray-600">
            <div className="space-y-2">
              <Select
                id="parcial"
                labelPlacement="outside"
                label={
                  <label className="text-blue-900 dark:text-white">
                    Parcial
                  </label>
                }
                startContent={
                  <DocumentTextIcon className="text-blue-900 dark:text-white h-6 w-6 " />
                }
                placeholder="Seleccione el parcial"
                selectedKeys={[parcialSeleccionado]}
                onChange={(e) => setParcialSeleccionado(e.target.value)}
                variant="bordered"
                classNames={{
                  base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black",
                  selectorIcon: "text-blue-900 dark:text-black", // Icono de la flecha del selector de opciones
                  popoverContent:
                    "bg-white dark:bg-gray-700 border border-blue-900 dark:border-black dark:text-white",
                  value: "text-black dark:text-white",
                }}
              >
                {parciales.map((parcial) => (
                  <SelectItem key={parcial.id} className="capitalize">
                    {parcial.parcial}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-end space-x-1">
                <Input
                  id="csv-upload"
                  labelPlacement="outside"
                  label={
                    <label className="text-blue-900 dark:text-white">
                      Subir Calificaciones
                    </label>
                  }
                  type="file"
                  accept=".csv"
                  variant="bordered"
                  onChange={handleFileUpload}
                  isDisabled={
                    parcialSeleccionado.toLowerCase() === "supletorio"
                  }
                  startContent={
                    <PaperClipIcon className="text-blue-900 dark:text-white h-6 w-6" />
                  }
                  classNames={{
                    base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black text-black dark:text-white disabled:cursor-not-allowed",
                    input: "text-black dark:text-white",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 space-x-2">
              <div className="grid grid-cols-1">
                <label className="text-blue-900 dark:text-white">
                  Descargar
                </label>
                <Button
                  variant="shadow"
                  color="success"
                  size="md"
                  className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg disabled:cursor-not-allowed"
                  onClick={descargarCalificaciones}
                >
                  Calificaciones
                </Button>
              </div>
              <div className="grid grid-cols-1">
                <label className="text-blue-900 dark:text-white">
                  Descargar
                </label>
                <Button
                  onClick={generarCSV}
                  variant="shadow"
                  color="success"
                  size="md"
                  className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg disabled:cursor-not-allowed"
                  disabled={parcialSeleccionado.toLowerCase() === "supletorio"}
                >
                  Plantilla
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="dark:bg-gray-700">
          <CardBody>
            {!etapaAnteriorCompleta && periodoActual > 1 && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                role="alert"
              >
                <div className="flex">
                  <ExclamationCircleIcon className="h-6 w-6 mr-2" />
                  <div>
                    <p className="font-bold">Atención</p>
                    <p>
                      No se pueden asignar calificaciones a esta etapa hasta que
                      se completen todas las calificaciones de la etapa
                      anterior.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto dark:bg-gray-700">
              {parcialSeleccionado === "supletorio" ? (
                // Tabla de calificaciones para el supletorio; Estudiante, promedio, estado, calificación
                <Table
                  aria-label="Tabla de calificaciones"
                  classNames={{
                    wrapper: "dark:bg-gray-700",
                    th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase",
                    tr: "dark:text-white dark:hover:text-gray-900 text-justify",
                  }}
                >
                  <TableHeader>
                    <TableColumn>Estudiante</TableColumn>
                    <TableColumn>Promedio</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn>Calificación</TableColumn>
                    <TableColumn>Promedio Final</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {calificacionesFiltradas.map((estudiante) => {
                      const promedio = calcularPromedioSupletorio(
                        estudiante.MATRICULA[0].CALIFICACION
                      ); //

                      const supletorioHabilitado =
                        parcialSeleccionado === "supletorio" &&
                        parciales
                          .filter(
                            (parcial) =>
                              parcial.parcial.toLowerCase() !== "supletorio"
                          )
                          .every((parcial) => !parcial.CIERREFASE[0].estado) &&
                        promedio >= 4 &&
                        promedio < 7;

                      // Calcula el promedio final dinámicamente
                      const supletorioNota =
                        estudiante.MATRICULA[0]?.SUPLETORIO?.nota || null;

                      return (
                        <TableRow key={estudiante.id}>
                          <TableCell className="capitalize">
                            {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                            {estudiante.PERSONA.nombre.toLowerCase()}
                          </TableCell>
                          <TableCell className="text-center">
                            {parseFloat(promedio).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            {promedio >= 7
                              ? "APROBADO"
                              : promedio < 4
                              ? "REPROBADO"
                              : "SUPLETORIO"}
                          </TableCell>
                          <TableCell className="text-center">
                            {!supletorioHabilitado ? (
                              <p>-</p>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={supletorioNota || ""}
                                onChange={(e) =>
                                  handleSupletorioChange(
                                    estudiante.id,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <p>
                              {parseFloat(
                                supletorioNota !== null &&
                                  supletorioNota !== undefined
                                  ? (parseFloat(promedio || 0) +
                                      parseFloat(supletorioNota)) /
                                      2
                                  : parseFloat(promedio || 0)
                              ).toFixed(2)}
                            </p>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Table
                  aria-label="Tabla de calificaciones"
                  classNames={{
                    wrapper: "dark:bg-gray-700",
                    th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase",
                    tr: "dark:text-white dark:hover:text-gray-900 text-justify",
                  }}
                >
                  <TableHeader>
                    <TableColumn>Estudiante</TableColumn>
                    <TableColumn>Aporte 1</TableColumn>
                    <TableColumn>Aporte 2</TableColumn>
                    <TableColumn>Aporte 3</TableColumn>
                    <TableColumn>Examen</TableColumn>
                    <TableColumn>Asistencia</TableColumn>
                    <TableColumn>Conducta</TableColumn>
                    <TableColumn>Promedio</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {calificacionesFiltradas.map((estudiante) => {
                      // Buscar la calificación del parcial seleccionado
                      const calificacionParcial =
                        estudiante.MATRICULA[0].CALIFICACION.find(
                          (calif) =>
                            String(calif.idParcial) === parcialSeleccionado
                        );

                      // Si no existe calificación para el parcial seleccionado, usar valores predeterminados
                      const aportes = calificacionParcial?.APORTE || [
                        { aporte: 0 },
                        { aporte: 0 },
                        { aporte: 0 },
                      ];
                      const examen = calificacionParcial?.EXAMEN[0]?.nota || 0;
                      const asistencia =
                        calificacionParcial?.ASISTENCIA[0]?.porcentaje || 0; // Valor de ejemplo
                      const conducta =
                        calificacionParcial?.CONDUCTA[0]?.puntaje || 0; // Valor de ejemplo

                      return (
                        <TableRow key={estudiante.id}>
                          {/* Estudiante */}
                          <TableCell className="capitalize">
                            <p>
                              {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                              {estudiante.PERSONA.nombre.toLowerCase()}
                            </p>
                          </TableCell>

                          {/* Aporte 1 */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              disabled={parcialCerrado}
                              value={aportes[0]?.aporte || 0}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "aporte1",
                                  0,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Aporte 2 */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              disabled={parcialCerrado}
                              value={aportes[1]?.aporte || 0}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "aporte2",
                                  1,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Aporte 3 */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              disabled={parcialCerrado}
                              value={aportes[2]?.aporte || 0}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "aporte3",
                                  2,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Examen */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              disabled={parcialCerrado}
                              value={examen}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "examen",
                                  0,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Asistencia */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              disabled={parcialCerrado}
                              value={asistencia}
                              endContent="%"
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "asistencia",
                                  0,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Conducta */}
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              disabled={parcialCerrado}
                              value={conducta}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "conducta",
                                  0,
                                  e.target.value
                                )
                              }
                              size="sm"
                            />
                          </TableCell>

                          {/* Promedio */}
                          <TableCell>
                            <p>
                              {calcularPromedio(aportes, [{ nota: examen }])}
                            </p>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardBody>
          <CardFooter className="justify-end">
            <div className="mt-4 flex justify-end">
              {parcialSeleccionado === "supletorio" ? (
                <Button
                  variant="shadow"
                  color="success"
                  size="lg"
                  className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg disabled:cursor-not-allowed"
                  //onClick={handleSubmitCalificaciones}
                  disabled={isLoading}
                >
                  Publicar Supletorio
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg disabled:cursor-not-allowed"
                  onClick={handleSubmitCalificaciones}
                  disabled={parcialCerrado || isLoading}
                >
                  Publicar Calificaciones
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CalificarParalelo;
