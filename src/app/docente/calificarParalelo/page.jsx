"use client";
import { useState, useEffect, useCallback } from "react";

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

import {
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";

import Notification from "@/app/components/Notification";
import CircularProgress from "@/app/components/CircularProgress";

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
  const [modalidad, setModalidad] = useState(modalidades[0]);
  const [periodoActual, setPeriodoActual] = useState(1);
  const [calificaciones, setCalificaciones] = useState({});
  const [etapaAnteriorCompleta, setEtapaAnteriorCompleta] = useState(true);
  const [calificacionesPublicadas, setCalificacionesPublicadas] =
    useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleFileUpload = (event) => {
    console.log("Archivo subido:", event.target.files[0]);
  };

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
          <CardHeader>
            <CardHeader className="font-semibold text-lg text-blue-900 dark:text-white">
              Configuración
            </CardHeader>
          </CardHeader>
          <CardBody className="flex flex-row gap-5 bg-yellow-300">
            <div className="space-y-2  w-1/4">
              <Select
                id="parcial"
                labelPlacement="outside"
                label="Parcial"
                placeholder="Seleccione el parcial"
                selectedKeys={[parcialSeleccionado]}
                onChange={(e) => setParcialSeleccionado(e.target.value)}
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
            <div className="space-y-2  w-1/4">
              <label htmlFor="csv-upload">Importar Calificaciones (CSV)</label>
              <div className="flex items-center space-x-2">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <Button size="sm">
                  <ArrowUpTrayIcon className="mr-2 h-4 w-4" /> Subir
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="">
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
            <div className="overflow-x-auto">
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
                <Table aria-label="Tabla de calificaciones">
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
                            {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                            {estudiante.PERSONA.nombre.toLowerCase()}
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
                                  !estudiante.calificacion.PARCIAL.CIERREFASE[0]
                                    .estado
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
                                  !estudiante.calificacion.PARCIAL.CIERREFASE[0]
                                    .estado
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
