import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idPersona } = params;
  try {
    const estudiante = await prisma.pERSONA.findUnique({
      where: {
        id: parseInt(idPersona),
      },
      include: {
        usuario: {
          select: {
            correo: true,
          },
        },
        campus: {
          select: {
            nombre: true,
          },
        },
        parroquia: {
          select: {
            parroquia: true,
            CANTON: {
              select: {
                canton: true,
                PROVINCIA: {
                  select: {
                    provincia: true,
                  },
                },
              },
            },
          },
        },
        estudiante: {
          include: {
            MATRICULA: {
              where: {
                PERIODO: {
                  estado: true, // Filtrar donde el PERIODO tenga estado = true
                },
              },
              select: {
                PERIODO: {
                  select: {
                    nombre: true,
                  },
                },
                DETALLEMATERIA: {
                  select: {
                    DETALLENIVELPARALELO: {
                      select: {
                        NIVEL: {
                          select: {
                            nivel: true,
                          },
                        },
                        CAMPUSESPECIALIDAD: {
                          select: {
                            ESPECIALIDAD: {
                              select: {
                                especialidad: true,
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
          },
        },
      },
    });
    return NextResponse.json(estudiante);
  } catch (error) {
    console.log(error);
  } finally {
  }
}
