"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import CircularProgress from "@/app/components/CircularProgress";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  User,
} from "@nextui-org/react";
import {
  UserGroupIcon,
  UsersIcon,
  BookOpenIcon,
  PuzzlePieceIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BarsArrowUpIcon,
  GlobeAltIcon,
  UserCircleIcon,
  MapIcon,
  MapPinIcon,
  HomeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

function Estudiante() {
  const { data: session } = useSession();
  const roles = session?.user?.roles || [];
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [dataEstudiante, setDataEstudiante] = useState(null);

  // Obtener los datos del docente
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const idPersona = localStorage.getItem("idPersona");

        const dataRes = await fetch(`/api/estudiante/${idPersona}`);
        if (!dataRes.ok) {
          throw new Error("Error al obtener los datos del estudiante");
        }

        const estudianteData = await dataRes.json();
        setDataEstudiante(estudianteData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData(); // Llamada a la función aquí
  }, []); // Solo ejecuta al montar el componente

  function formatDateWithAge(fechaNacimiento) {
    if (!fechaNacimiento) return "";

    // Convertir la fecha de nacimiento a un objeto Date
    const birthDate = new Date(fechaNacimiento);

    // Formatear la fecha (usamos toLocaleDateString para obtener el formato 'YYYY-MM-DD')
    const formattedDate = birthDate.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Calcular la edad
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Retornar la fecha formateada con la edad entre paréntesis
    return `${formattedDate} (${age} años)`;
  }

  // Contenido de la página de administrador
  return (
    <div>
      {isLoading && <CircularProgress />}
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <h2 className="pt-24 px-10 font-extrabold text-3xl text-blue-900 dark:text-white capitalize">
          Bienvenido, {dataEstudiante?.nombre} {dataEstudiante?.apellido}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8  mx-10 my-8">
          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Especialidad
              <PuzzlePieceIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>

            <CardBody className="p-4">
              <p className="text-2xl font-extrabold capitalize">
                {dataEstudiante?.estudiante?.MATRICULA?.at(
                  -1
                )?.DETALLEMATERIA?.DETALLENIVELPARALELO?.CAMPUSESPECIALIDAD?.ESPECIALIDAD?.especialidad.toLowerCase()}
              </p>
            </CardBody>

            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground capitalize">
                <strong>Periodo:</strong>{" "}
                {dataEstudiante?.estudiante?.MATRICULA?.at(
                  -1
                )?.PERIODO?.nombre.toLowerCase()}
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Nivel
              <BarsArrowUpIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-2xl font-extrabold capitalize">
                {dataEstudiante?.estudiante?.MATRICULA?.at(
                  -1
                )?.DETALLEMATERIA?.DETALLENIVELPARALELO?.NIVEL?.nivel.toLowerCase()}
              </p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">Actual</p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Materias
              <BookOpenIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">
                {dataEstudiante?.estudiante?.MATRICULA.length}
              </p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">Matriculado</p>
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
                name={dataEstudiante?.nombre.toLowerCase()}
                classNames={{
                  name: "text-lg capitalize",
                }}
                description={
                  <Link href="" size="md" isExternal>
                    {dataEstudiante?.usuario?.correo}
                  </Link>
                }
                avatarProps={{
                  src: dataEstudiante?.foto,
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
                    <p>{dataEstudiante?.cedula}</p>
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
                    <p className="capitalize">
                      {dataEstudiante?.campus?.nombre.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <PuzzlePieceIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Especialidad
                    </p>
                    <p className="capitalize">
                      {dataEstudiante?.estudiante?.MATRICULA?.at(
                        -1
                      )?.DETALLEMATERIA?.DETALLENIVELPARALELO?.CAMPUSESPECIALIDAD?.ESPECIALIDAD?.especialidad.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <BarsArrowUpIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Nivel
                    </p>
                    <p className="capitalize">
                      {dataEstudiante?.estudiante?.MATRICULA?.at(
                        -1
                      )?.DETALLEMATERIA?.DETALLENIVELPARALELO?.NIVEL?.nivel.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.nacionalidad.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.sexo.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.parroquia?.CANTON?.PROVINCIA?.provincia.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.parroquia?.CANTON?.canton.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.parroquia?.parroquia.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <HomeIcon className="text-blue-900 dark:text-white h-5 w-5 " />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
                      Dirección
                    </p>
                    <p className="capitalize">
                      {dataEstudiante?.direccion.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataEstudiante?.telefono.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {formatDateWithAge(dataEstudiante?.fechaNacimiento)}
                    </p>
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

export default Estudiante;
