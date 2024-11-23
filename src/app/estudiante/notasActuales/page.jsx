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
} from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Datos de ejemplo (en una aplicación real, estos datos vendrían de una API)
const periodos = [
  { id: 1, nombre: "Primer Quimestre" },
  { id: 2, nombre: "Segundo Quimestre" },
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
    periodos[0].id
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
        <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
          Resumen Académico
          <select
            className="border border-gray-300 rounded-lg p-2"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(parseInt(e.target.value))}
          >
            {periodos.map((periodo) => (
              <option key={periodo.id} value={periodo.id}>
                {periodo.nombre}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Badge color="primary" variant="flat">
              Promedio General: {promedioGeneral}
            </Badge>
          </div>
          <Accordion>
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
                      <span className="text-gray-700">{materia.nombre}</span>
                      <Badge color={estado.color} className="ml-4">
                        {estado.texto}
                      </Badge>
                    </div>
                  }
                >
                  <div className="mt-4">
                    <table className="table-auto w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Tipo</th>
                          <th className="px-4 py-2 text-left">Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calificaciones[periodoSeleccionado][
                          materia.id
                        ].aportes.map((aporte, index) => (
                          <tr key={`aporte-${index}`}>
                            <td className="px-4 py-2">Aporte {index + 1}</td>
                            <td className="px-4 py-2">{aporte.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="px-4 py-2">Examen</td>
                          <td className="px-4 py-2">
                            {calificaciones[periodoSeleccionado][
                              materia.id
                            ].examen.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="font-bold bg-gray-50">
                          <td className="px-4 py-2">Promedio Final</td>
                          <td className="px-4 py-2">{promedio}</td>
                        </tr>
                      </tbody>
                    </table>
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
