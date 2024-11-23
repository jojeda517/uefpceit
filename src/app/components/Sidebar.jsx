"use client";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Input,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  InboxIcon,
  PowerIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  FolderArrowDownIcon,
  TagIcon,
  LockClosedIcon,
  BuildingOffice2Icon,
  BarsArrowUpIcon,
  SquaresPlusIcon,
  SparklesIcon,
  Cog8ToothIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  BuildingLibraryIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useCallback, memo } from "react";
import { signOut } from "next-auth/react";
import CircularProgress from "@/app/components/CircularProgress";
import { useRouter } from "next/navigation";

function Sidebar({ roles }) {
  const [open, setOpen] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOpen = useCallback((value) => {
    setOpen((prevOpen) => (prevOpen === value ? 0 : value));
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleNavigation = (path) => {
    try {
      setIsLoading(true);
      router.push(path);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      closeDrawer();
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setIsLoading(true);
    localStorage.clear(); // Limpiar todo el localStorage
    signOut({ callbackUrl: "/" });
  };

  const hasRole = (role) => roles.includes(role);

  return (
    <>
      {isLoading && <CircularProgress />}
      <IconButton
        className="hover:bg-blue-800 dark:hover:bg-gray-700"
        variant="text"
        size="lg"
        onClick={openDrawer}
      >
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2 text-white" />
        )}
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        className="bg-blue-900 dark:bg-gray-900"
      >
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4"
        >
          <div className="mb-2 flex items-center gap-4 p-4">
            <img src="/logo.png" alt="brand" className="h-8 w-8" />
            <Typography variant="h5" color="white">
              Menú
            </Typography>
          </div>
          {/* <div className="p-2 text-white">
            <Input
              icon={<MagnifyingGlassIcon className="h-5 w-5 " />}
              label="Buscar"
              className="text-white placeholder:text-white"
            />
          </div> */}
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            <List className="text-white">
              {/* OPCIONES DEL ROL DE ADMINISTRADOR */}
              {hasRole("Administrador") && (
                <>
                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador")}
                  >
                    <ListItemPrefix>
                      <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Perfil administrador
                  </ListItem>

                  <Accordion
                    open={open === 1}
                    icon={
                      <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`mx-auto h-4 w-4 transition-transform ${
                          open === 1 ? "rotate-180" : ""
                        } `}
                      />
                    }
                  >
                    <ListItem className="p-0" selected={open === 1}>
                      <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                      >
                        <ListItemPrefix>
                          <UserCircleIcon className="h-5 w-5 text-white" />
                        </ListItemPrefix>
                        <Typography
                          color="white"
                          className="mr-auto font-normal"
                        >
                          Perfiles
                        </Typography>
                      </AccordionHeader>
                    </ListItem>

                    <AccordionBody className="py-1">
                      <List className="p-0 text-white">
                        <ListItem
                          onClick={() =>
                            handleNavigation("/administrador/perfilDocente")
                          }
                        >
                          <ListItemPrefix>
                            <BriefcaseIcon
                              strokeWidth={3}
                              className="h-3 w-5"
                            />
                          </ListItemPrefix>
                          Docentes
                        </ListItem>

                        <ListItem
                          onClick={() =>
                            handleNavigation("/administrador/perfilEstudiante")
                          }
                        >
                          <ListItemPrefix>
                            <AcademicCapIcon
                              strokeWidth={3}
                              className="h-3 w-5"
                            />
                          </ListItemPrefix>
                          Estudiantes
                        </ListItem>
                      </List>
                    </AccordionBody>
                  </Accordion>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/campus")}
                  >
                    <ListItemPrefix>
                      <BuildingOffice2Icon className="h-5 w-5" />
                    </ListItemPrefix>
                    Campus
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/periodo")}
                  >
                    <ListItemPrefix>
                      <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Periodos
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/nivel")}
                  >
                    <ListItemPrefix>
                      <BarsArrowUpIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Niveles
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() =>
                      handleNavigation("/administrador/especialidad")
                    }
                  >
                    <ListItemPrefix>
                      <PuzzlePieceIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Especialidades
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/paralelo")}
                  >
                    <ListItemPrefix>
                      <SquaresPlusIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Paralelos
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/materia")}
                  >
                    <ListItemPrefix>
                      <BookOpenIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Materias
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/administrador/matricula")}
                  >
                    <ListItemPrefix>
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Matriculas
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() =>
                      handleNavigation("/administrador/matriculaDocente")
                    }
                  >
                    <ListItemPrefix>
                      <TagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Asignar docentes a materias
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <DocumentTextIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Actas de Grado
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Tipos de matricula
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <FolderArrowDownIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Retiro de carpeta
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <LockClosedIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Cerrar periodo
                  </ListItem>
                </>
              )}

              {/* OPCIONES DEL ROL DOCENTE */}
              {hasRole("Docente") && (
                <>
                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/docente")}
                  >
                    <ListItemPrefix>
                      <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Perfil docente
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() =>
                      handleNavigation("/docente/paralelosDocente")
                    }
                  >
                    <ListItemPrefix>
                      <SparklesIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Calificar
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/docente/actualizarDatos")}
                  >
                    <ListItemPrefix>
                      <Cog8ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Configuración
                  </ListItem>
                </>
              )}

              {/* OPCIONES DEL ROL ESTUDIANTE */}
              {hasRole("Estudiante") && (
                <>
                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() => handleNavigation("/estudiante")}
                  >
                    <ListItemPrefix>
                      <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Perfil
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() =>
                      handleNavigation("/estudiante/notasActuales")
                    }
                  >
                    <ListItemPrefix>
                      <PresentationChartLineIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Notas actuales
                  </ListItem>

                  <ListItem
                    className="text-white cursor-pointer"
                    onClick={() =>
                      handleNavigation("/estudiante/actualizarDatos")
                    }
                  >
                    <ListItemPrefix>
                      <Cog8ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Configuración
                  </ListItem>
                </>
              )}

              {(hasRole("Administrador") || hasRole("Docente")) && (
                <>
                  <hr className="my-2 border-blue-gray-50" />
                </>
              )}
              <Accordion
                open={open === 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === 1 ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                {/* REPORTES */}
                {(hasRole("Administrador") || hasRole("Docente")) && (
                  <>
                    <ListItem className="p-0" selected={open === 1}>
                      <AccordionHeader
                        onClick={() => handleOpen(1)}
                        className="border-b-0 p-3"
                      >
                        <ListItemPrefix>
                          <PresentationChartBarIcon className="h-5 w-5 text-white" />
                        </ListItemPrefix>
                        <Typography
                          color="white"
                          className="mr-auto font-normal"
                        >
                          Reportes
                        </Typography>
                      </AccordionHeader>
                    </ListItem>

                    <AccordionBody className="py-1">
                      <List className="p-0 text-white">
                        {hasRole("Administrador") && (
                          <>
                            <ListItem>
                              <ListItemPrefix>
                                <UserGroupIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Docentes
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <AcademicCapIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Estudiantes
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <DocumentCheckIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Matriculas
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <BuildingLibraryIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Cursos
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <StarIcon strokeWidth={3} className="h-3 w-5" />
                              </ListItemPrefix>
                              Notas
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <ExclamationTriangleIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Estudiantes perdidos
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <ArrowPathIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Estudiantes en supletorio
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <ChartBarIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Boletín
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <CheckBadgeIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Certificado de matricula
                            </ListItem>
                          </>
                        )}

                        {hasRole("Docente") && (
                          <>
                            <ListItem>
                              <ListItemPrefix>
                                <CheckBadgeIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Calificaciones
                            </ListItem>

                            <ListItem>
                              <ListItemPrefix>
                                <CheckBadgeIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Alumnos
                            </ListItem>
                          </>
                        )}
                      </List>
                    </AccordionBody>
                  </>
                )}
              </Accordion>

              <hr className="my-2 border-blue-gray-50" />
              <ListItem onClick={handleSignOut} className="cursor-pointer">
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Cerrar sesión
              </ListItem>
            </List>
          </div>
        </Card>
      </Drawer>
    </>
  );
}

export default memo(Sidebar);
