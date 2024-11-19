"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import CircularProgress from "@/app/components/CircularProgress";
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

function Adinistrador() {
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [dataDocente, setDataDocente] = useState(null);

  // Obtener los datos del docente
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const idPersona = localStorage.getItem("idPersona");

        const dataRes = await fetch(`/api/administrador/${idPersona}`);
        if (!dataRes.ok) {
          throw new Error("Error al obtener los datos del docente");
        }

        const docenteData = await dataRes.json();
        setDataDocente(docenteData);
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

  return (
    <div>
      {isLoading && <CircularProgress />}
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <h2 className="pt-24 px-10 font-extrabold text-3xl text-blue-900 dark:text-white capitalize">
          Bienvenido, {dataDocente?.persona?.nombre}{" "}
          {dataDocente?.persona?.apellido}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8  mx-10 my-8">
          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Total de Estudiantes
              <BookOpenIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>

            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">
                {dataDocente?.estadisticas?.countEstudiantes}
              </p>
            </CardBody>

            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground capitalize">
                <strong>Periodo:</strong>{" "}
                {dataDocente?.persona?.docente?.MATRICULA[0]?.PERIODO?.nombre}
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Total de Docentes
              <UserIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">
                {dataDocente?.estadisticas?.countDocentes}
              </p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Matriculados
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Total de Cursos
              <StarIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">
                contar
              </p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                En el periodo actual
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-700 dark:text-white">
            <CardHeader className="p-4 flex flex-row items-center justify-between text-base font-semibold dark:bg-default-900 bg-gray-100">
              Total de Especialidades
              <StarIcon className="text-blue-900 dark:text-white h-6 w-6 " />
            </CardHeader>
            <CardBody className="p-4">
              <p className="text-3xl font-extrabold">
                contar...
              </p>
            </CardBody>
            <CardFooter className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Impartidas en el periodo actual
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
                name={dataDocente?.persona?.nombre}
                classNames={{
                  name: "text-lg",
                }}
                description={
                  <Link href="" size="md" isExternal>
                    {dataDocente?.persona?.usuario?.correo}
                  </Link>
                }
                avatarProps={{
                  src: dataDocente?.persona?.foto,
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
                    <p>{dataDocente?.persona?.cedula}</p>
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
                      {dataDocente?.persona?.campus?.nombre}
                    </p>
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
                    <p className="capitalize">
                      {dataDocente?.persona?.docente?.DETALLEDOCENTETITULO?.at(
                        -1
                      )?.TITULO.titulo.toLowerCase()}
                    </p>
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
                    <p>{dataDocente?.persona?.docente?.tiempoExperiencia}</p>
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
                      {dataDocente?.persona?.nacionalidad.toLowerCase()}
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
                      {dataDocente?.persona?.sexo.toLowerCase()}
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
                      {dataDocente?.persona?.parroquia?.CANTON?.PROVINCIA?.provincia.toLowerCase()}
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
                      {dataDocente?.persona?.parroquia?.CANTON?.canton.toLowerCase()}
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
                      {dataDocente?.persona?.parroquia?.parroquia.toLowerCase()}
                    </p>
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
                    <p className="capitalize">
                      {dataDocente?.persona?.direccion.toLowerCase()}
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
                      {dataDocente?.persona?.telefono.toLowerCase()}
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
                      {formatDateWithAge(dataDocente?.persona?.fechaNacimiento)}
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

export default Adinistrador;
