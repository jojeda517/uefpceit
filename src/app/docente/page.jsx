"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  Tab,
  Link,
  User,
} from "@nextui-org/react";
import {
  BookOpenIcon,
  UserIcon,
  StarIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  UserCircleIcon,
  MapIcon,
  MapPinIcon,
  HomeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

function Docente() {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];
  const [periodoActual, setPeriodoActual] = useState("Primer Quimestre 2024");

  const clases = [
    {
      id: 1,
      nombre: "Física I",
      curso: "10mo A",
      estudiantes: 30,
      promedioClase: 8.2,
    },
    {
      id: 2,
      nombre: "Física II",
      curso: "11mo B",
      estudiantes: 28,
      promedioClase: 7.8,
    },
    {
      id: 3,
      nombre: "Laboratorio de Física",
      curso: "12mo A",
      estudiantes: 25,
      promedioClase: 8.5,
    },
  ];

  const totalEstudiantes = 60; // clases.reduce((sum, clase) => sum + clase.estudiantes, 0);
  const promedioGeneral = 5;

  const docente = {
    nombre: "Dr. Carlos Rodríguez",
    id: "DOC-2024-001",
    departamento: "Ciencias",
    especialidad: "Física",
    foto: "/placeholder-user.jpg",
  };
  //clases.reduce((sum, clase) => sum + clase.promedioClase, 0) / clases.length;

  // Contenido de la página de administrador
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <h2 className="pt-24 px-10 font-extrabold text-3xl text-blue-900 dark:text-white">
          Bienvenido, {docente.nombre}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8  mx-10 my-8">
          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Cursos Activos
              <BookOpenIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>

            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">{clases.length}</p>
            </CardBody>

            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                <strong>Periodo:</strong> {periodoActual}
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Total de Estudiantes
              <UserIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">{totalEstudiantes}</p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                En todas las clases
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Materias Impartidas
              <StarIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">10</p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                En el periodo actual
              </p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex flex-col gap-4 mx-10 pb-10">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white">
            Información Personal
          </h3>
          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-5 dark:bg-default-900 bg-gray-100">
              <User
                name={docente.nombre}
                classNames={{
                  name: "text-lg",
                }}
                description={
                  <Link
                    href="https://twitter.com/jrgarciadevJ"
                    size="md"
                    isExternal
                  >
                    @jrgarciadev
                  </Link>
                }
                avatarProps={{
                  src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                }}
              />
            </CardHeader>
            <CardBody className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div>
                    <IdentificationIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Cedúla de Identidad
                    </p>
                    <p>1850435171</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <BuildingOfficeIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Campus
                    </p>
                    <p>La Matríz</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <AcademicCapIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Título Académico
                    </p>
                    <p>Ingeniero en Software</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <BriefcaseIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Años de Experiencia
                    </p>
                    <p>2</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <GlobeAltIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Nacionalidad
                    </p>
                    <p>Ecuatoriano</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <UserCircleIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Género
                    </p>
                    <p>Masculino</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <MapIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Provincia
                    </p>
                    <p>Tungurahua</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <MapPinIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Cantón
                    </p>
                    <p>Pelileo</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <BuildingLibraryIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Parroquia
                    </p>
                    <p>Garcia Moreno</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <HomeIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Direccion
                    </p>
                    <p>Calle 23 de Octubre</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <PhoneIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Télefono
                    </p>
                    <p>0998595903</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <CalendarIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Fecha de Nacimiento
                    </p>
                    <p>24/01/1999</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Docente;
