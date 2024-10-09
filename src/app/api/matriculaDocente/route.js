import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  const result = await prisma.dOCENTE.findMany({
    where: {
      MATRICULA: {
        some: {
          PERIODO: {
            estado: true, // Filtrar por el periodo activo
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
          id: true,
          PERIODO: {
            select: {
              nombre: true, // Nombre del periodo
            },
          },
          DETALLEMATERIA: {
            select: {
              MATERIA: {
                select: {
                  nombre: true, // Nombre de la materia
                },
              },
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
                      CAMPUS: {
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

  // Utilizar un set para almacenar claves únicas (materia, nivel, paralelo, especialidad, docente)
  const uniqueResult = new Map();

  result.forEach((docente) => {
    docente.MATRICULA.forEach((matricula) => {
      const key = `${docente.PERSONA.nombre}-${docente.PERSONA.apellido}-${matricula.DETALLEMATERIA.MATERIA.nombre}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad}`;

      if (!uniqueResult.has(key)) {
        uniqueResult.set(key, {
          id: matricula.id,
          PERSONA: docente.PERSONA,
          MATERIA: matricula.DETALLEMATERIA.MATERIA.nombre,
          NIVEL: matricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel,
          PARALELO:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo,
          ESPECIALIDAD:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
              .ESPECIALIDAD.especialidad,
          CAMPUS:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
              .CAMPUS.nombre,
          PERIODO: matricula.PERIODO.nombre, // Nombre del periodo
        });
      }
    });
  });

  // Convertir los valores del Map en un array para la respuesta final
  const filteredResult = Array.from(uniqueResult.values());

  return NextResponse.json(filteredResult);
}
