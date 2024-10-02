import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  const result = await prisma.eSTUDIANTE.findMany({
    where: {
      MATRICULA: {
        some: {
          PERIODO: {
            estado: true, // Filtrar por periodo activo
          },
        },
      },
    },
    select: {
      PERSONA: {
        select: {
          nombre: true,
          apellido: true,
          foto: true,
          usuario: {
            select: {
              correo: true,
            },
          },
        },
      },
      MATRICULA: {
        select: {
          PERIODO: {
            select: {
              nombre: true, // Nombre del periodo
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
                  PARALELO: {
                    select: {
                      paralelo: true,
                    },
                  },
                  CAMPUSESPECIALIDAD: {
                    select: {
                      ESPECIALIDAD: {
                        select: {
                          especialidad: true,
                        },
                      },
                      CAMPUS: { // Seleccionar el campus
                        select: {
                          nombre: true, // Nombre del campus
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

  // Filtrar manualmente para obtener solo una matrícula única por estudiante
  const filteredResult = result.map(estudiante => {
    const primeraMatricula = estudiante.MATRICULA[0]; // Tomamos solo la primera matrícula

    return {
      PERSONA: estudiante.PERSONA,
      MATRICULA: primeraMatricula ? {
        NIVEL: primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel,
        PARALELO: primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo,
        ESPECIALIDAD: primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad,
        CAMPUS: primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.CAMPUS.nombre, // Nombre del campus
        PERIODO: primeraMatricula.PERIODO.nombre, // Nombre del periodo
      } : null,
    };
  });

  return NextResponse.json(filteredResult);
}
