import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(_, { params }) {
  try {
    const { idCampus, idPeriodo } = params;

    if (!idCampus || !idPeriodo) {
      return NextResponse.json(
        { message: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    const campusId = parseInt(idCampus);
    const periodoId = parseInt(idPeriodo);

    // Consulta a Prisma con orden basado en los IDs
    const estudiantesUnicos = await prisma.MATRICULA.findMany({
      where: {
        idPeriodoPertenece: periodoId,
        DETALLEMATERIA: {
          DETALLENIVELPARALELO: {
            idCampusPertenece: campusId,
          },
        },
      },
      include: {
        ESTUDIANTE: {
          include: {
            PERSONA: true,
          },
        },
        DETALLEMATERIA: {
          include: {
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
      orderBy: [
        {
          DETALLEMATERIA: {
            DETALLENIVELPARALELO: {
              NIVEL: {
                id: "asc", // Ordenar por ID del nivel
              },
            },
          },
        },
        {
          DETALLEMATERIA: {
            DETALLENIVELPARALELO: {
              PARALELO: {
                id: "asc", // Ordenar por ID del paralelo
              },
            },
          },
        },
        {
          DETALLEMATERIA: {
            DETALLENIVELPARALELO: {
              CAMPUSESPECIALIDAD: {
                ESPECIALIDAD: {
                  id: "asc", // Ordenar por ID de la especialidad
                },
              },
            },
          },
        },
      ],
    });

    // Procesar los resultados y estructurar el reporte
    const reporte = {};

    estudiantesUnicos.forEach((matricula) => {
      const estudiante = matricula.ESTUDIANTE;
      const { sexo } = estudiante.PERSONA;
      const { DETALLENIVELPARALELO } = matricula.DETALLEMATERIA;

      const curso = `${DETALLENIVELPARALELO.NIVEL.nivel} "${DETALLENIVELPARALELO.PARALELO.paralelo}" - ${DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad}`;

      if (!reporte[curso]) {
        reporte[curso] = {
          curso,
          masculinos: 0,
          femeninos: 0,
          otros: 0,
          total: 0,
          estudiantes: new Set(),
        };
      }

      if (!reporte[curso].estudiantes.has(estudiante.id)) {
        reporte[curso].estudiantes.add(estudiante.id);

        if (sexo.toLowerCase() === "masculino") {
          reporte[curso].masculinos += 1;
        } else if (sexo.toLowerCase() === "femenino") {
          reporte[curso].femeninos += 1;
        } else {
          reporte[curso].otros += 1;
        }

        reporte[curso].total += 1;
      }
    });

    // Convertir el reporte en una lista para enviar la respuesta
    const resultado = Object.entries(reporte).map(([curso, datos]) => {
      const { estudiantes, ...resto } = datos; // Remover el Set
      return {
        curso,
        ...resto,
      };
    });

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del reporte" },
      { status: 500 }
    );
  }
}
