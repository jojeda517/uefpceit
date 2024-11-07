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
  const [parcialSeleccionado, setParcialSeleccionado] = useState(null);
  const [modalidad, setModalidad] = useState(modalidades[0]);
  const [periodoActual, setPeriodoActual] = useState(1);
  const [calificaciones, setCalificaciones] = useState({});
  const [etapaAnteriorCompleta, setEtapaAnteriorCompleta] = useState(true);
  const [calificacionesPublicadas, setCalificacionesPublicadas] =
    useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificacion, setNotificacion] = useState({ message: "", type: "" });
  const [estudiantes, setEstudiantes] = useState([]);
  const [maxAportes, setMaxAportes] = useState();
  const [maxExamenes, setMaxExamenes] = useState();

  useEffect(() => {
    // Recuperar los datos del almacenamiento local
    const storedParalelo = localStorage.getItem("selectedParalelo");
    if (storedParalelo) {
      const parsedParaleloData = JSON.parse(storedParalelo);
      setParaleloData(parsedParaleloData);

      // Cargar datos iniciales una vez que tenemos el paraleloData
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          // Configurar URL de estudiantes con los datos del almacenamiento local
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

          // Ejecutar ambas solicitudes en paralelo
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

          // Procesar datos de estudiantes
          let maxAportes = 0;
          let maxExamenes = 0;

          estudiantesData.forEach((estudiante) => {
            estudiante.MATRICULA.forEach((matricula) => {
              matricula.CALIFICACION.forEach((calificacion) => {
                if (calificacion.APORTE?.length > 0) {
                  maxAportes = Math.max(maxAportes, calificacion.APORTE.length);
                }
                if (calificacion.EXAMEN?.length > 0) {
                  maxExamenes = Math.max(
                    maxExamenes,
                    calificacion.EXAMEN.length
                  );
                }
              });
            });
          });

          // Asignar valores mínimos si es necesario
          if (maxAportes === 0) maxAportes = 3;
          if (maxExamenes === 0) maxExamenes = 1;

          // Actualizar el estado con los datos recibidos
          setEstudiantes(estudiantesData);
          setParciales(parcialesData);
          setMaxAportes(maxAportes);
          setMaxExamenes(maxExamenes);
          setParcialSeleccionado(String(parcialesData[0].id));
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
    verificarEtapaAnterior();
  }, [calificaciones, periodoActual]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const verificarEtapaAnterior = () => {
    if (periodoActual > 1) {
      const periodoAnteriorCompleto = Object.values(calificaciones).every(
        (estudiante) =>
          estudiante[periodoActual - 1] &&
          estudiante[periodoActual - 1].aportes.every((nota) => nota !== "") &&
          estudiante[periodoActual - 1].examenes.every((nota) => nota !== "")
      );
      setEtapaAnteriorCompleta(periodoAnteriorCompleto);
    } else {
      setEtapaAnteriorCompleta(true);
    }
  };

  const handleFileUpload = (event) => {
    console.log("Archivo subido:", event.target.files[0]);
  };

  const agregarAporte = () => setMaxAportes((prev) => prev + 1);
  const eliminarAporte = () => setMaxAportes((prev) => Math.max(1, prev - 1));

  const handleCalificacionChange = (estudianteId, tipo, index, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [estudianteId]: {
        ...prev[estudianteId],
        [periodoActual]: {
          ...prev[estudianteId][periodoActual],
          [tipo]: prev[estudianteId][periodoActual][tipo].map((cal, i) =>
            i === index ? valor : cal
          ),
        },
      },
    }));
  };

  const verificarCalificacionesCompletas = () => {
    return Object.values(calificaciones).every(
      (estudiante) =>
        estudiante[periodoActual].aportes.every((nota) => nota !== "") &&
        estudiante[periodoActual].examenes.every((nota) => nota !== "")
    );
  };

  const publicarCalificaciones = () => {
    if (verificarCalificacionesCompletas()) {
      setDialogoPublicarAbierto(true);
    } else {
      setNotificacion({
        message:
          "Asegúrese de que todos los aportes y exámenes tengan una calificación.",
        type: "error",
      });
    }
  };

  const confirmarPublicacion = () => {
    setCalificacionesPublicadas(true);
    setDialogoPublicarAbierto(false);
    // Aquí iría la lógica para enviar las calificaciones al backend
    console.log("Calificaciones publicadas:", calificaciones);
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
                onSelectionChange={setParcialSeleccionado}
                selectedKeys={parcialSeleccionado}
              >
                {parciales.map((parcial) => (
                  <SelectItem key={parcial.id} className="capitalize">
                    {parcial.parcial}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-2  w-1/4">
              <label>Estructura de Evaluación</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>Aportes: {maxAportes}</span>
                  <div>
                    <Button
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
                      disabled={maxAportes <= 1}
                    >
                      <MinusCircleIcon className="h-7 w-7 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
                  {estudiantes.map((estudiante) => {
                    // Obtenemos la primera matrícula y calificación para cada estudiante
                    const matricula = estudiante.MATRICULA[0]; // Asumiendo una matrícula por estudiante en esta lista
                    const calificacion = matricula.CALIFICACION[0] || {}; // Tomamos la primera calificación o un objeto vacío
                    const aportes = calificacion.APORTE || []; // Array de aportes
                    const examenes = calificacion.EXAMEN || []; // Array de exámenes
                    const promedio = calificacion.promedio || ""; // Promedio de la calificación, si existe

                    return (
                      <TableRow key={estudiante.id}>
                        <TableCell className="capitalize">
                          {estudiante.PERSONA.apellido.toLowerCase()}{" "}
                          {estudiante.PERSONA.nombre.toLowerCase()}
                        </TableCell>

                        {/* Renderizamos los aportes en sus columnas */}
                        {Array.from({ length: maxAportes }, (_, i) => (
                          <TableCell key={`aporte-${i}`}>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              value={aportes[i]?.aporte || ""}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "aportes",
                                  i,
                                  e.target.value
                                )
                              }
                              isDisabled={
                                !etapaAnteriorCompleta ||
                                calificacionesPublicadas
                              }
                              size="sm"
                            />
                          </TableCell>
                        ))}

                        {/* Renderizamos los exámenes en sus columnas */}
                        {Array.from({ length: maxExamenes }, (_, i) => (
                          <TableCell key={`examen-${i}`}>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.01"
                              value={examenes[i]?.nota || ""}
                              onChange={(e) =>
                                handleCalificacionChange(
                                  estudiante.id,
                                  "examenes",
                                  i,
                                  e.target.value
                                )
                              }
                              isDisabled={
                                !etapaAnteriorCompleta ||
                                calificacionesPublicadas
                              }
                              size="sm"
                            />
                          </TableCell>
                        ))}

                        {/* Columna de Promedio */}
                        <TableCell>{promedio}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={publicarCalificaciones}
                isDisabled={calificacionesPublicadas || !etapaAnteriorCompleta}
              >
                {calificacionesPublicadas
                  ? "Calificaciones Publicadas"
                  : "Publicar Calificaciones"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirmar Publicación de Calificaciones</ModalHeader>
          <ModalBody>
            ¿Está seguro de que desea publicar las calificaciones? Una vez
            publicadas, no podrá editarlas.
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onClick={confirmarPublicacion}>
              Confirmar Publicación
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CalificarParalelo;
