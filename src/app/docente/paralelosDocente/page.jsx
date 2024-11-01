"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, Chip, CardBody } from "@nextui-org/react";

import {
  BookOpenIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

import CircularProgress from "@/app/components/CircularProgress";

const paralelosDocente1 = [
  {
    id: 1,
    paralelo: "A",
    materia: "Matemáticas",
    campus: "Central",
    nivel: "Bachillerato",
    especialidad: "Ciencias",
  },
  {
    id: 2,
    paralelo: "B",
    materia: "Física",
    campus: "Norte",
    nivel: "Bachillerato",
    especialidad: "Ciencias",
  },
  {
    id: 3,
    paralelo: "C",
    materia: "Química",
    campus: "Sur",
    nivel: "Bachillerato",
    especialidad: "Ciencias",
  },
  {
    id: 4,
    paralelo: "A",
    materia: "Biología",
    campus: "Central",
    nivel: "Bachillerato",
    especialidad: "Ciencias",
  },
  {
    id: 5,
    paralelo: "D",
    materia: "Historia",
    campus: "Este",
    nivel: "Bachillerato",
    especialidad: "Sociales",
  },
  {
    id: 6,
    paralelo: "B",
    materia: "Literatura",
    campus: "Oeste",
    nivel: "Bachillerato",
    especialidad: "Sociales",
  },
];

function ParalelosDocente() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const { data: session } = useSession();
  const idPersonaPertenece = session?.user?.idPersonaPertenece || null;
  const [paralelosDocente, setParalelosDocente] = useState([]);

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [paralelosDocenteRes] = await Promise.all([
        fetch(`/api/paralelosDocente/${idPersonaPertenece}`),
      ]);

      const [paralelosDocenteData] = await Promise.all([
        paralelosDocenteRes.json(),
      ]);

      setParalelosDocente(paralelosDocenteData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [idPersonaPertenece]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col gap-4 pt-24 pb-10 min-h-screen w-full px-10">
      {isLoading && <CircularProgress />}
      <div className="">
        <div className="grid grid-cols-1 gap-2 pb-5">
          <h2 className="font-extrabold text-3xl text-blue-900 dark:text-white">
            Mis Paralelos
          </h2>
          <p className="font-light text-lg text-black dark:text-white">
            Aquí puedes ver los paralelos que tienes asignados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paralelosDocente.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white border-blue-200 overflow-hidden dark:bg-gray-300"
          >
            <CardHeader className="bg-blue-900 text-white p-4 dark:bg-gray-900">
              <CardHeader className="text-2xl flex items-center justify-between capitalize">
                <span>
                  Paralelo{" "}
                  {item.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo}
                </span>
                <Chip variant="secondary" className="text-blue-900 bg-white capitalize">
                  {item.DETALLEMATERIA.MATERIA.nombre.toLowerCase()}
                </Chip>
              </CardHeader>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BookOpenIcon className="w-5 h-5 text-blue-700" />
                  <span className="text-lg font-semibold text-blue-900 capitalize">
                    {item.DETALLEMATERIA.MATERIA.nombre.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-blue-700" />
                  <span className="text-gray-600 dark:text-black capitalize">
                    Campus:{" "}
                    {
                      item.DETALLEMATERIA.DETALLENIVELPARALELO
                        .CAMPUSESPECIALIDAD.CAMPUS.nombre
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-5 h-5 text-blue-700" />
                  <span className="text-gray-600 dark:text-black capitalize">
                    Nivel:{" "}
                    {item.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-blue-700" />
                  <span className="text-gray-600 dark:text-black capitalize">
                    Especialidad:{" "}
                    {
                      item.DETALLEMATERIA.DETALLENIVELPARALELO
                        .CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad
                    }
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ParalelosDocente;
