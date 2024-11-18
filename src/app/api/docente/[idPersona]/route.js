import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { select } from "@nextui-org/react";

// GET para obtener los datos de la persona
export async function GET(req, { params }) {
  const { idPersona } = params;

  try {
    const docente = await prisma.pERSONA.findUnique({
      where: { id: parseInt(idPersona) },
      include: {
        campus: {
          select: {
            nombre: true,
          },
        },
        docente: {
          include: {
            DETALLEDOCENTETITULO: {
              include: {
                TITULO: {
                  select: {
                    titulo: true,
                  },
                },
              },
              orderBy: {
                TITULO: {
                  id: "asc", // o 'desc' si quieres el orden descendente
                },
              },
            },
            MATRICULA: {
              include: {
                PERIODO: {
                  select: {
                    nombre: true,
                  },
                },
                DETALLEMATERIA: {
                  include: {
                    MATERIA: true,
                    DETALLENIVELPARALELO: {
                      include: {
                        NIVEL: true,
                        PARALELO: true,
                        CAMPUSESPECIALIDAD: {
                          include: {
                            ESPECIALIDAD: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        parroquia: {
          include: {
            CANTON: {
              include: {
                PROVINCIA: {
                  select: {
                    provincia: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    return NextResponse.json(docente);
  } catch (error) {
    console.error("Error al obtener los datos del docente:", error);
    return NextResponse.error({
      error: "Error al obtener los datos del docente",
    });
  }
}
