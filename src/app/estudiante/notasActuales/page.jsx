"use client";
import { useState } from "react";
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

// Datos de ejemplo (en una aplicación real, estos datos vendrían de una API)
const parciales = [
  { id: 1, parcial: "Primer Quimestre" },
  { id: 2, parcial: "Segundo Quimestre" },
  { id: 3, parcial: "Supletorio" },
];

const materias = [
  { id: 1, nombre: "Matemáticas", profesor: "Dr. García" },
  { id: 2, nombre: "Lenguaje", profesor: "Lic. Rodríguez" },
  { id: 3, nombre: "Ciencias Naturales", profesor: "Ing. Martínez" },
  { id: 4, nombre: "Estudios Sociales", profesor: "Lic. López" },
  { id: 5, nombre: "Inglés", profesor: "Msc. Smith" },
];

const calificaciones = {
  1: {
    1: { aportes: [8.5, 9.0, 7.5], examen: 8.0 },
    2: { aportes: [7.0, 8.5, 9.0], examen: 8.5 },
    3: { aportes: [9.5, 9.0, 9.5], examen: 9.0 },
    4: { aportes: [8.0, 8.5, 8.0], examen: 8.5 },
    5: { aportes: [7.5, 8.0, 8.5], examen: 8.0 },
  },
  2: {
    1: { aportes: [9.0, 8.5, 9.0], examen: 9.5 },
    2: { aportes: [8.5, 9.0, 8.5], examen: 9.0 },
    3: { aportes: [9.0, 9.5, 9.0], examen: 9.5 },
    4: { aportes: [8.5, 9.0, 8.5], examen: 9.0 },
    5: { aportes: [8.0, 8.5, 9.0], examen: 8.5 },
  },
};

function NotasActuales() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(
    parciales[0].id
  );

  const calcularPromedio = (materiaId) => {
    const notasMateria = calificaciones[periodoSeleccionado][materiaId];
    const sumaAportes = notasMateria.aportes.reduce((a, b) => a + b, 0);
    const promedioAportes = sumaAportes / notasMateria.aportes.length;
    return (promedioAportes * 0.8 + notasMateria.examen * 0.2).toFixed(2);
  };

  const obtenerEstado = (promedio) => {
    if (promedio >= 9) return { texto: "Excelente", color: "success" };
    if (promedio >= 8) return { texto: "Muy Bueno", color: "primary" };
    if (promedio >= 7) return { texto: "Bueno", color: "warning" };
    return { texto: "Necesita Mejorar", color: "danger" };
  };

  const promedioGeneral = (
    Object.keys(calificaciones[periodoSeleccionado]).reduce(
      (sum, materiaId) => sum + parseFloat(calcularPromedio(materiaId)),
      0
    ) / materias.length
  ).toFixed(2);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
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
                  base: "border border-blue-900 dark:border-white dark:text-white",
                }}
              >
                Promedio General: {promedioGeneral}
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
            {materias.map((materia) => {
              const promedio = calcularPromedio(materia.id);
              const estado = obtenerEstado(promedio);
              return (
                <AccordionItem
                  key={materia.id}
                  aria-label={materia.nombre}
                  startIcon={
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  }
                  title={
                    <div className="flex justify-between items-center w-full">
                      <p className="">{materia.nombre}</p>
                      <div className="grid grid-cols-2 gap-5">
                        <p>
                          Promedio:{" "}
                          <span className="font-semibold">{promedio}</span>
                        </p>
                        <Chip color={estado.color} className="ml-4">
                          {estado.texto}
                        </Chip>
                      </div>
                    </div>
                  }
                >
                  <div className="mt-4">
                    <Table
                      classNames={{
                        wrapper: "dark:bg-gray-700",
                        th: "bg-gray-200 text-black dark:bg-gray-800 dark:text-white text-center uppercase",
                        tr: "dark:text-white text-center",
                        td: "text-center",
                      }}
                    >
                      <TableHeader>
                        <TableColumn className="px-4 py-2">
                          Tipo
                        </TableColumn>
                        <TableColumn className="px-4 py-2">
                          Calificación
                        </TableColumn>
                      </TableHeader>
                      <TableBody>
                        {calificaciones[periodoSeleccionado][
                          materia.id
                        ].aportes.map((aporte, index) => (
                          <TableRow key={`aporte-${index}`}>
                            <TableCell className="px-4 py-2">
                              Aporte {index + 1}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                              {aporte.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="px-4 py-2">Examen</TableCell>
                          <TableCell className="px-4 py-2">
                            {calificaciones[periodoSeleccionado][
                              materia.id
                            ].examen.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell className="px-4 py-2">
                            PROMEDIO
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {promedio}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
