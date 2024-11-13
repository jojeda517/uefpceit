"use client";
import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

import {
  Card,
  CardHeader,
  Select,
  CardBody,
  SelectItem,
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableColumn,
  TableCell,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
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

const modalidades = [
  { id: 1, nombre: "Etapas", periodos: 2 },
  { id: 2, nombre: "Quimestres", periodos: 2 },
  { id: 3, nombre: "Trimestres", periodos: 3 },
];

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

  const agregarAporte = () => setMaxAportes((prev) => prev + 1);
  const eliminarAporte = () => setMaxAportes((prev) => Math.max(1, prev - 1));

  const handleCalificacionChange = (idEstudiante, tipo, index, valor) => {
    setCalificacionesFiltradas((prevCalificaciones) =>
      prevCalificaciones.map((estudiante) => {
        if (estudiante.id === idEstudiante) {
          // Verificar que 'calificacion' esté definido
          if (!estudiante.calificacion) {
            estudiante.calificacion = { APORTE: [], EXAMEN: [] }; // Inicializar si no existe
          }

          // Verificar que 'APORTE' esté definido
          if (!estudiante.calificacion.APORTE) {
            estudiante.calificacion.APORTE = []; // Inicializar si no existe
          }

          // Asegurarse de que el índice exista en 'APORTE'
          if (!estudiante.calificacion.APORTE[index]) {
            estudiante.calificacion.APORTE[index] = { aporte: 0 }; // Inicializa el objeto si no existe
          }

          // Actualizar el valor de aporte
          if (tipo === "aportes") {
            estudiante.calificacion.APORTE[index] = {
              ...estudiante.calificacion.APORTE[index],
              aporte: parseFloat(valor) || 0,
            };
          }

          // Verificar que 'EXAMEN' esté definido
          if (!estudiante.calificacion.EXAMEN) {
            estudiante.calificacion.EXAMEN = []; // Inicializar si no existe
          }

          // Asegurarse de que el índice exista en 'EXAMEN'
          if (!estudiante.calificacion.EXAMEN[index]) {
            estudiante.calificacion.EXAMEN[index] = { nota: 0 }; // Inicializa el objeto si no existe
          }

          // Actualizar el valor de examen
          if (tipo === "examenes") {
            estudiante.calificacion.EXAMEN[index] = {
              ...estudiante.calificacion.EXAMEN[index],
              nota: parseFloat(valor) || 0,
            };
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

          // Determina la cantidad de aportes necesaria
          const cantidadDeAportes = Math.max(aportes.length, maxAportes);

          // Maneja la nota del examen correctamente o establece 0 si no está definida
          const cantidadDeExamenes =
            examenes.length > 0 && examenes[0]?.nota !== undefined
              ? examenes[0].nota
              : 0;

          // Ajusta los aportes al número máximo de columnas, reemplazando valores faltantes con 0
          const aportesAjustados = Array(cantidadDeAportes)
            .fill(0)
            .map((_, index) => aportes[index]?.aporte || 0);

          // Calcula el promedio de los aportes (ajusta la división para el promedio)
          const promedioAportes =
            aportesAjustados.reduce((sum, val) => sum + val, 0) / maxAportes; // evita dividir por 0

          // Calcula el promedio del examen directamente o usa 0 si no existe
          const promedioExamenes = cantidadDeExamenes || 0;

          // Cálculo final del promedio, ponderando aportes y exámenes
          const promedio = parseFloat(
            (promedioAportes * 0.7 + promedioExamenes * 0.3).toFixed(2)
          );

          return {
            idEstudiante: estudiante.id,
            aportes: aportesAjustados,
            examenes: cantidadDeExamenes,
            promedio, // Añadimos el promedio aquí
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

      await fetchInitialData();

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
      ];

      // Datos de los estudiantes formateados
      const filas = estudiantes.map((estudiante) => [
        estudiante.PERSONA.cedula,
        `${estudiante.PERSONA.apellido} ${estudiante.PERSONA.nombre}`,
        "", // Aporte 1 vacío
        "", // Aporte 2 vacío
        "", // Aporte 3 vacío
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

            // Procesa el CSV y actualiza calificacionesFiltradas
            const updatedCalificaciones = estudiantes.map((estudiante) => {
              const estudianteData = parsedData.find(
                (row) => row.Cedula === estudiante.PERSONA.cedula
              );

              if (estudianteData) {
                return {
                  ...estudiante,
                  calificacion: {
                    APORTE: [
                      { aporte: parseFloat(estudianteData["Aporte 1"] || 0) },
                      { aporte: parseFloat(estudianteData["Aporte 2"] || 0) },
                      { aporte: parseFloat(estudianteData["Aporte 3"] || 0) },
                    ],
                    EXAMEN: [
                      { nota: parseFloat(estudianteData["Examen"] || 0) },
                    ],
                  },
                };
              }
              return estudiante;
            });

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
            {/* <div className="space-y-2  w-1/4">
              <label>Estructura de Evaluación</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>Aportes: {maxAportes}</span>
                  <div>
                    <Button
                      // Deshabilitado cuando el número de aportes es 5 o más
                      isDisabled={maxAportes >= 5}
                      onClick={agregarAporte}
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircleIcon className="h-7 w-7 text-green-600" />
                    </Button>
                    <Button
                      onClick={eliminarAporte}
                      variant="outline"
                      size="sm"
                      isDisabled={maxAportes <= 3}
                    >
                      <MinusCircleIcon className="h-7 w-7 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div> */}
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
                  startContent={
                    <PaperClipIcon className="text-blue-900 dark:text-white h-6 w-6" />
                  }
                  title="Subir archivo CSV"
                  classNames={{
                    base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black text-black dark:text-white",
                    input: "text-black dark:text-white",
                  }}
                />
                <Button
                  variant="shadow"
                  color="primary"
                  size="md"
                  disabled={parcialSeleccionado === "supletorio" || isLoading}
                  /* startContent={
                    <ArrowUpTrayIcon className="text-blue-900 dark:text-white h-96 w-96" /> 
                  } */
                  className="text-lg dark:bg-gray-900 shadow-lg shadow-white dark:text-white"
                >
                  Subir
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-blue-900 dark:text-white">Plantilla</label>
              <Button
                //onClick={descargarPlantilla}
                onClick={generarCSV}
                variant="shadow"
                color="success"
                size="md"
                className="w-full text-lg dark:bg-gray-900 shadow-lg shadow-white dark:text-white disabled:cursor-not-allowed"
                disabled={parcialSeleccionado === "supletorio"}
              >
                Descargar Plantilla
              </Button>
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
                <Table aria-label="Tabla de calificaciones">
                  <TableHeader>
                    <TableColumn>Estudiante</TableColumn>
                    <TableColumn>Promedio</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn>Calificación</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {calificacionesFiltradas.map((estudiante) => (
                      <TableRow key={estudiante.id}>
                        <TableCell className="capitalize">
                          {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                          {estudiante.PERSONA.nombre.toLowerCase()}
                        </TableCell>
                        <TableCell>promedio...</TableCell>
                        <TableCell>estado...</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            size="sm"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table
                  aria-label="Tabla de calificaciones"
                  //selectionMode="single"
                  classNames={{
                    wrapper: "dark:bg-gray-700", // Es necesario ajustar la altura máxima de la tabla
                    th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase", // Es la cabecera
                    tr: "dark:text-white dark:hover:text-gray-900 text-justify", // Es la fila
                  }}
                >
                  <TableHeader>
                    <TableColumn>Estudiante</TableColumn>
                    {Array.from({ length: maxAportes }, (_, i) => (
                      <TableColumn key={`aporte-${i}`}>
                        Aporte {i + 1}
                      </TableColumn>
                    ))}
                    {Array.from({ length: maxExamenes }, (_, i) => (
                      <TableColumn key={`examen-${i}`}>
                        Examen {i + 1}
                      </TableColumn>
                    ))}
                    <TableColumn>Promedio</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {calificacionesFiltradas.map((estudiante) => {
                      // Verificar si existen las calificaciones, aportes y exámenes
                      const aportes = estudiante.calificacion?.APORTE || [];
                      const examenes = estudiante.calificacion?.EXAMEN || [];

                      return (
                        <TableRow key={estudiante.id}>
                          <TableCell className="capitalize">
                            <p>
                              {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                              {estudiante.PERSONA.nombre.toLowerCase()}
                            </p>
                          </TableCell>

                          {Array.from({ length: maxAportes }, (_, i) => (
                            <TableCell key={`aporte-${i}`}>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={aportes[i]?.aporte || 0}
                                onChange={(e) =>
                                  handleCalificacionChange(
                                    estudiante.id,
                                    "aportes",
                                    i,
                                    e.target.value
                                  )
                                }
                                //isDisabled={!etapaAnteriorCompleta}
                                disabled={
                                  !estudiante?.calificacion?.PARCIAL
                                    ?.CIERREFASE[0]?.estado
                                }
                                size="sm"
                              />
                            </TableCell>
                          ))}

                          {Array.from({ length: maxExamenes }, (_, i) => (
                            <TableCell key={`examen-${i}`}>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={examenes[i]?.nota || 0}
                                onChange={(e) =>
                                  handleCalificacionChange(
                                    estudiante.id,
                                    "examenes",
                                    i,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  !estudiante?.calificacion?.PARCIAL
                                    ?.CIERREFASE[0]?.estado
                                }
                                size="sm"
                              />
                            </TableCell>
                          ))}

                          <TableCell>
                            {calcularPromedio(aportes, examenes)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-gradient-to-tr from-blue-900 to-green-500 text-white shadow-green-500 shadow-lg"
                onClick={handleSubmitCalificaciones}
                //isDisabled={calificacionesPublicadas || !etapaAnteriorCompleta}
              >
                {calificacionesPublicadas
                  ? "Calificaciones Publicadas"
                  : "Publicar Calificaciones"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default CalificarParalelo;
