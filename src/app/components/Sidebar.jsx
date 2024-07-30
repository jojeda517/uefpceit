"use client";
import React from "react";
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
import { useState } from "react";
import { signOut } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function Sidebar({ roles }) {
  const [open, setOpen] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleSignOut = () => {
    setIsLoading(true);
    const baseUrl = process.env.NEXTAUTH_URL;
    signOut({ callbackUrl: baseUrl });
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => roles.includes(role);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo semi-transparente
            zIndex: 9999,
          }}
        >
          <CircularProgress size={50} />
        </div>
      )}
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2 text-white" />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer} className="bg-blue-900">
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
          <div className="p-2 text-white">
            <Input
              icon={<MagnifyingGlassIcon className="h-5 w-5 " />}
              label="Buscar"
              className="text-white placeholder:text-white"
            />
          </div>
          <div className="overflow-y-auto h-[calc(100vh-10rem)]">
            <List className="text-white">
              {/* OPCIONES DEL ROL DE ADMINISTRADOR */}
              {hasRole("Administrador") && (
                <>
                  <ListItem className="text-white">
                    <ListItemPrefix>
                      <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Periodos
                    <ListItemSuffix />
                  </ListItem>
                  {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}
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
                        <ListItem>
                          <ListItemPrefix>
                            <BriefcaseIcon
                              strokeWidth={3}
                              className="h-3 w-5"
                            />
                          </ListItemPrefix>
                          Docentes
                        </ListItem>

                        <Link href="/administrador/datos">
                          <ListItem>
                            <ListItemPrefix>
                              <AcademicCapIcon
                                strokeWidth={3}
                                className="h-3 w-5"
                              />
                            </ListItemPrefix>
                            Estudiantes
                          </ListItem>
                        </Link>
                      </List>
                    </AccordionBody>
                  </Accordion>
                  {/* aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa */}

                  <ListItem>
                    <ListItemPrefix>
                      <BookOpenIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Materias
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Matriculas
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
                      <PuzzlePieceIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Especialidades
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <FolderArrowDownIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Retiro de carpeta
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <TagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Asignar docentes a materias
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
                <ListItem>
                  <ListItemPrefix>
                    <LockClosedIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Calificar
                </ListItem>
              )}

              {/* OPCIONES DEL ROL ESTUDIANTE */}
              {hasRole("Estudiante") && (
                <>
                  <ListItem>
                    <ListItemPrefix>
                      <LockClosedIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Notas actuales
                  </ListItem>

                  <ListItem>
                    <ListItemPrefix>
                      <LockClosedIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Horario
                  </ListItem>
                </>
              )}

              <hr className="my-2 border-blue-gray-50" />
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

                            <ListItem>
                              <ListItemPrefix>
                                <CheckBadgeIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              Materias
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
