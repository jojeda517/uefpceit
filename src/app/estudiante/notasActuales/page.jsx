"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Chip,
  Table,
  TableHeader,
  TableRow,
  TableColumn,
  TableCell,
  TableBody,
} from "@nextui-org/react";
import { ChevronDownIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import CircularProgress from "@/app/components/CircularProgress";

function NotasActuales() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [parcialSeleccionado, setParcialSeleccionado] = useState("");
  const [matriculas, setMatriculas] = useState([]);
  const [parciales, setParciales] = useState([]);
  const [promedioParcial, setPromedioParcial] = useState(0);
  const [promedioGeneralPeriodo, setPromedioGeneralPeriodo] = useState(0); // Promedio general del período

  useEffect(() => {
    setIsLoading(true);
    try {
      const idPersona = localStorage.getItem("idPersona");
      fetch(`/api/estudiante/calificaciones/${idPersona}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener matriculas");
          return res.json();
        })
        .then((data) => {
          setMatriculas(data);
        })
        .catch((err) => {
          console.error("Error al obtener matriculas:", err);
        });
    } catch (error) {
      console.error("Error al obtener las matriculas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (matriculas.length > 0 && matriculas[0]?.PERIODO?.evaluacion?.id) {
        fetch(`/api/parcial/${matriculas[0].PERIODO.evaluacion.id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Error al obtener parciales");
            return res.json();
          })
          .then((data) => {
            // Agregar el parcial general
            data.push({ id: "general", parcial: "General" });
            setParciales(data);
            setParcialSeleccionado(String(data[0].id));
          })
          .catch((err) => {
            console.error("Error al obtener parciales:", err);
          });
      }
    } catch (error) {
      console.error("Error al obtener parciales:", error);
    } finally {
      setIsLoading(false);
    }
  }, [matriculas]);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (matriculas.length > 0 && parciales.length > 0) {
        setPromedioParcial(
          calcularPromedioGeneral(matriculas, parcialSeleccionado)
        );
        setPromedioGeneralPeriodo(calcularPromedioGeneralPeriodo(matriculas)); // Calculamos el promedio general del período
      }
    } catch (error) {
      console.error("Error al calcular promedio general:", error);
    } finally {
      setIsLoading(false);
    }
  }, [matriculas, parciales, parcialSeleccionado]);

  // Función para calcular el promedio general
  function calcularPromedioGeneral(matriculas, parcialSeleccionado) {
    // Inicializamos el total y el número de materias con calificación
    let sumaPromedios = 0;
    let contadorMaterias = 0;

    // Iteramos sobre las matriculas (materias)
    matriculas.forEach((materia) => {
      let promedioMateria = 0;

      // Verificamos si la materia tiene una calificación para el parcial seleccionado
      const calificacion = materia?.CALIFICACION?.find(
        (cal) => cal?.idParcial === parseInt(parcialSeleccionado)
      );

      // Si no tiene calificación, asignamos 0, si tiene, tomamos el promedio calculado
      if (calificacion) {
        promedioMateria = calificacion.promedio ?? 0;
      }

      // Acumulamos el promedio por materia solo si tiene calificación
      sumaPromedios += promedioMateria;
      contadorMaterias += 1;
    });

    // Calculamos el promedio general
    const promedioGeneral =
      contadorMaterias > 0 ? sumaPromedios / contadorMaterias : 0;

    return promedioGeneral;
  }

  // Función para calcular el promedio general del período (todos los parciales de todas las materias)
  // Función para calcular el promedio general del período
  // Función para calcular el promedio general del período
  function calcularPromedioGeneralPeriodo(matriculas) {
    let sumaPromedios = 0;
    let contadorMaterias = 0;

    matriculas.forEach((materia) => {
      let promedioMateria = 0;

      if (materia?.SUPLETORIO?.nota != null) {
        // Si hay supletorio, calculamos el promedio con su nota
        promedioMateria = (
          (materia?.SUPLETORIO?.nota +
            materia?.CALIFICACION?.reduce(
              (acc, calificacion) => acc + (calificacion?.promedio ?? 0),
              0
            ) /
              Math.max(parciales.length - 1, 1)) /
          2
        ).toFixed(2); // Redondeamos a 2 decimales
      } else {
        // Si no hay supletorio, solo calculamos el promedio de los parciales
        promedioMateria = (
          materia?.CALIFICACION?.reduce(
            (acc, calificacion) => acc + (calificacion?.promedio ?? 0),
            0
          ) / Math.max(parciales.length - 1, 1)
        ).toFixed(2); // Redondeamos a 2 decimales
      }

      sumaPromedios += parseFloat(promedioMateria); // Convertimos a float para hacer la suma
      contadorMaterias += 1;
    });

    // Redondeamos el promedio general a 2 decimales
    return contadorMaterias > 0
      ? (sumaPromedios / contadorMaterias).toFixed(2)
      : "0.00";
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Calificaciones
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Aquí puedes ver tus calificaciones actuales.
          </p>
        </div>
      </div>

      <Card className="dark:bg-gray-700 dark:text-white">
        <CardHeader className="p-4 grid grid-cols-1 gap-5 items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
          <p className="font-semibold text-lg text-blue-900 dark:text-white">
            Resumen Académico
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {/* Selector de Parcial */}
            <div className="w-full sm:w-3/4">
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
                variant="bordered"
                selectedKeys={[parcialSeleccionado]}
                onChange={(e) => setParcialSeleccionado(e.target.value)}
                classNames={{
                  base: "border border-blue-900 dark:border-black rounded-xl focus:ring-blue-900 dark:focus:ring-black focus:border-blue-900 dark:focus:border-black w-full",
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

            {/* Chip con Promedio General */}
            <div className="flex items-center justify-center sm:justify-end sm:items-end">
              <Chip
                color="primary"
                variant="bordered"
                size="lg"
                className="w-full sm:w-auto"
                classNames={{
                  base: "border border-blue-900 dark:border-white dark:text-white capitalize",
                }}
              >
                {parcialSeleccionado
                  ? // Si hay un parcial seleccionado, mostramos el promedio correspondiente
                    parcialSeleccionado === "general"
                    ? `Promedio General: ${promedioGeneralPeriodo}`
                    : `${parciales
                        .find(
                          (parcial) =>
                            parcial.id === parseInt(parcialSeleccionado)
                        )
                        ?.parcial.toLowerCase()} : ${promedioParcial.toFixed(
                        2
                      )}`
                  : // Si no se ha seleccionado ningún parcial, no mostramos nada
                    ""}
              </Chip>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Accordion
            itemClasses={{
              title: "dark:text-white",
            }}
          >
            {matriculas.map((materia) => {
              const estado = "Necesita Mejorar";
              return (
                <AccordionItem
                  key={materia.id}
                  aria-label={materia?.DETALLEMATERIA?.MATERIA?.nombre}
                  startIcon={
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  }
                  title={
                    <div className="flex justify-between items-center w-full">
                      <p className="capitalize">
                        {materia?.DETALLEMATERIA?.MATERIA?.nombre.toLowerCase()}
                      </p>

                      <p>
                        Promedio:{" "}
                        <strong>
                          {parcialSeleccionado === "general"
                            ? materia?.SUPLETORIO?.nota != null
                              ? // Si hay supletorio, calculamos el promedio con su nota
                                (
                                  (materia?.SUPLETORIO?.nota +
                                    // Promedio de los parciales
                                    materia?.CALIFICACION?.reduce(
                                      (acc, calificacion) =>
                                        acc + (calificacion?.promedio ?? 0),
                                      0
                                    ) /
                                      Math.max(parciales.length - 1, 1)) /
                                  2
                                ).toFixed(2)
                              : // Si no hay supletorio, solo calculamos el promedio de los parciales
                                (
                                  materia?.CALIFICACION?.reduce(
                                    (acc, calificacion) =>
                                      acc + (calificacion?.promedio ?? 0),
                                    0
                                  ) / Math.max(parciales.length - 1, 1)
                                ).toFixed(2)
                            : materia?.CALIFICACION?.find(
                                // buscar notas de un parcial específico
                                (calificacion) =>
                                  calificacion?.idParcial ===
                                  parseInt(parcialSeleccionado)
                              )?.promedio ?? (0.0).toFixed(2)}
                        </strong>
                      </p>
                    </div>
                  }
                >
                  <div className="mt-4">
                    {/* si selecciona general */}
                    {parcialSeleccionado === "general" ? (
                      <Table
                        classNames={{
                          wrapper: "dark:bg-gray-700",
                          th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase",
                          tr: "dark:text-white text-center",
                          td: "text-center",
                        }}
                      >
                        <TableHeader>
                          <TableColumn className="px-4 py-2">Tipo</TableColumn>
                          <TableColumn className="px-4 py-2">
                            Calificación
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Promedio</TableCell>
                            <TableCell>
                              {/* promedio de los promedios de cada parcial */}
                              {(
                                materia?.CALIFICACION?.reduce(
                                  (acc, calificacion) =>
                                    acc + calificacion?.promedio ?? 0,
                                  0
                                ) /
                                  (parciales.length - 1) ?? 0
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Supletorio</TableCell>
                            <TableCell>
                              {materia?.SUPLETORIO?.nota ?? "-"}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-extrabold">
                              Promedio General
                            </TableCell>
                            <TableCell>
                              <Chip color="primary">
                                {/* promedio general de la materia en caso de que SUPLETORIO no sea null */}
                                {materia?.SUPLETORIO?.nota != null
                                  ? // Si hay supletorio, calculamos el promedio con su nota
                                    (
                                      (materia?.SUPLETORIO?.nota +
                                        // Promedio de los parciales
                                        materia?.CALIFICACION?.reduce(
                                          (acc, calificacion) =>
                                            acc + (calificacion?.promedio ?? 0),
                                          0
                                        ) /
                                          Math.max(parciales.length - 1, 1)) /
                                      2
                                    ).toFixed(2)
                                  : // Si no hay supletorio, solo calculamos el promedio de los parciales
                                    (
                                      materia?.CALIFICACION?.reduce(
                                        (acc, calificacion) =>
                                          acc + (calificacion?.promedio ?? 0),
                                        0
                                      ) / Math.max(parciales.length - 1, 1)
                                    ).toFixed(2)}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    ) : (
                      <Table
                        classNames={{
                          wrapper: "dark:bg-gray-700",
                          th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase",
                          tr: "dark:text-white text-center",
                          td: "text-center",
                        }}
                      >
                        <TableHeader>
                          <TableColumn className="px-4 py-2">Tipo</TableColumn>
                          <TableColumn className="px-4 py-2">
                            Calificación
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Aporte 1</TableCell>
                            <TableCell>
                              {materia?.CALIFICACION?.find(
                                (calificacion) =>
                                  calificacion?.idParcial ===
                                  parseInt(parcialSeleccionado)
                              )?.APORTE[0]?.aporte ?? (0.0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Aporte 2</TableCell>
                            <TableCell>
                              {materia?.CALIFICACION?.find(
                                // buscar notas de un parcial específico
                                (calificacion) =>
                                  calificacion?.idParcial ===
                                  parseInt(parcialSeleccionado)
                              )?.APORTE[1]?.aporte ?? (0.0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Aporte 3</TableCell>
                            <TableCell>
                              {materia?.CALIFICACION?.find(
                                // buscar notas de un parcial específico
                                (calificacion) =>
                                  calificacion?.idParcial ===
                                  parseInt(parcialSeleccionado)
                              )?.APORTE[2]?.aporte ?? (0.0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Examen</TableCell>
                            <TableCell>
                              {materia?.CALIFICACION?.find(
                                // buscar notas de un parcial específico
                                (calificacion) =>
                                  calificacion?.idParcial ===
                                  parseInt(parcialSeleccionado)
                              )?.EXAMEN[0]?.nota ?? (0.0).toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Conducta</TableCell>
                            <TableCell>
                              <Chip color="success" variant="bordered">
                                {materia?.CALIFICACION?.find(
                                  // buscar notas de un parcial específico
                                  (calificacion) =>
                                    calificacion?.idParcial ===
                                    parseInt(parcialSeleccionado)
                                )?.CONDUCTA[0]?.puntaje ?? (0.0).toFixed(2)}
                              </Chip>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Asistencia</TableCell>
                            <TableCell>
                              <Chip color="success" variant="bordered">
                                {materia?.CALIFICACION?.find(
                                  // buscar notas de un parcial específico
                                  (calificacion) =>
                                    calificacion?.idParcial ===
                                    parseInt(parcialSeleccionado)
                                )?.ASISTENCIA[0]?.porcentaje ??
                                  (0.0).toFixed(2)}
                                <strong>%</strong>
                              </Chip>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-extrabold">
                              Promedio
                            </TableCell>
                            <TableCell>
                              <Chip color="primary">
                                {materia?.CALIFICACION?.find(
                                  // buscar notas de un parcial específico
                                  (calificacion) =>
                                    calificacion?.idParcial ===
                                    parseInt(parcialSeleccionado)
                                )?.promedio ?? (0.0).toFixed(2)}
                              </Chip>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}

export default NotasActuales;
