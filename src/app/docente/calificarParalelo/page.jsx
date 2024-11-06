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
  MinusIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

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
  const [idPersona, setIdPersona] = useState(null); // Modalidad de evaluación
  const [modalidad, setModalidad] = useState(modalidades[0]);
  const [periodoActual, setPeriodoActual] = useState(1);
  const [aportes, setAportes] = useState(3);
  const [examenes, setExamenes] = useState(1);
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
    setIdPersona(localStorage.getItem("idPersona"));
    if (storedParalelo) {
      const paraleloData = JSON.parse(storedParalelo);
      setParaleloData(paraleloData);

      // Una vez que tenemos paraleloData, podemos realizar la solicitud con los parámetros adecuados
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
          const estudiantesRes = await fetch(
            `/api/estudiantesParalelo/${localStorage.getItem("idPersona")}/${paraleloData.PERIODO.id}/${paraleloData.DETALLEMATERIA.MATERIA.id}/${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.id}/${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.id}/${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.CAMPUS.id}/${paraleloData.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.id}`
          );
          const estudiantesData = await estudiantesRes.json();

          // Inicializamos con el valor mínimo de columnas
          let maxAportes = 0;
          let maxExamenes = 0;

          // Determinar el número máximo de aportes y exámenes
          estudiantesData.forEach((estudiante) => {
            estudiante.MATRICULA.forEach((matricula) => {
              matricula.CALIFICACION.forEach((calificacion) => {
                if (calificacion.APORTE && calificacion.APORTE.length > 0) {
                  maxAportes = Math.max(maxAportes, calificacion.APORTE.length);
                }
                if (calificacion.EXAMEN && calificacion.EXAMEN.length > 0) {
                  maxExamenes = Math.max(
                    maxExamenes,
                    calificacion.EXAMEN.length
                  );
                }
              });
            });
          });

          // Valores mínimos por defecto si no se encuentra ninguno
          if (maxAportes === 0) maxAportes = 3;
          if (maxExamenes === 0) maxExamenes = 1;

          // Establecemos los valores en el estado
          setMaxAportes(maxAportes);
          setMaxExamenes(maxExamenes);
          setEstudiantes(estudiantesData);
        } catch (error) {
          console.error("Error fetching initial data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    inicializarCalificaciones();
  }, [modalidad, aportes, examenes]);

  useEffect(() => {
    verificarEtapaAnterior();
  }, [calificaciones, periodoActual]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inicializarCalificaciones = () => {
    const nuevasCalificaciones = {};
    estudiantes.forEach((estudiante) => {
      nuevasCalificaciones[estudiante.id] = {};
      for (let periodo = 1; periodo <= modalidad.periodos; periodo++) {
        nuevasCalificaciones[estudiante.id][periodo] = {
          aportes: Array(aportes).fill(""),
          examenes: Array(examenes).fill(""),
        };
      }
    });
    setCalificaciones(nuevasCalificaciones);
    setCalificacionesPublicadas(false);
  };

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

  const agregarAporte = () => setAportes((prev) => prev + 1);
  const eliminarAporte = () => setAportes((prev) => Math.max(1, prev - 1));
  const agregarExamen = () => setExamenes((prev) => prev + 1);
  const eliminarExamen = () => setExamenes((prev) => Math.max(1, prev - 1));

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

  // Función para calcular el número máximo de aportes y exámenes
  const obtenerMaxAportesYExamenes = (estudiantes) => {
    let maxAportes = 3; // Establece un mínimo de 3 aportes
    let maxExamenes = 1; // Establece un mínimo de 1 examen

    estudiantes.forEach((estudiante) => {
      estudiante.MATRICULA.forEach((matricula) => {
        matricula.CALIFICACION.forEach((calificacion) => {
          maxAportes = Math.max(maxAportes, calificacion.APORTE.size);
          maxExamenes = Math.max(maxExamenes, calificacion.EXAMEN.size);
        });
      });
    });

    console.log("maximo", maxAportes);
    console.log("maximo examenes", maxExamenes);

    return { maxAportes, maxExamenes };
  };

  // Llamada a la función para obtener los máximos
  //const { maxAportes, maxExamenes } = obtenerMaxAportesYExamenes(estudiantes);

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
            <div className="space-y-2 bg-pink-500 w-1/4">
              <label htmlFor="modalidad">Modalidad de Evaluación</label>
              <Select
                id="modalidad"
                aria-labelledby="modalidad"
                placeholder="Seleccione el parcial"
                onChange={(e) => {
                  const newModalidad = modalidades.find(
                    (m) => m.id === parseInt(e.target.value)
                  );
                  setModalidad(newModalidad);
                  setPeriodoActual(1);
                }}
              >
                {modalidades.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-2  w-1/4">
              <label htmlFor="periodo">Periodo Actual</label>
              <Select
                id="periodo"
                aria-labelledby="periodo"
                placeholder="Seleccione periodo"
                selectedKeys={[periodoActual.toString()]}
                onChange={(e) => setPeriodoActual(parseInt(e.target.value))}
                isDisabled={!etapaAnteriorCompleta}
              >
                {Array.from({ length: modalidad.periodos }, (_, i) => (
                  <SelectItem
                    key={(i + 1).toString()}
                    value={(i + 1).toString()}
                  >
                    {modalidad.nombre === "Trimestres"
                      ? `Trimestre ${i + 1}`
                      : modalidad.nombre === "Quimestres"
                      ? `Quimestre ${i + 1}`
                      : `Etapa ${i + 1}`}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="space-y-2  w-1/4">
              <label>Estructura de Evaluación</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>Aportes: {aportes}</span>
                  <div>
                    <Button
                      onClick={agregarAporte}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={eliminarAporte}
                      variant="outline"
                      size="sm"
                      disabled={aportes <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Exámenes: {examenes}</span>
                  <div>
                    <Button
                      onClick={agregarExamen}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={eliminarExamen}
                      variant="outline"
                      size="sm"
                      disabled={examenes <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
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
