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
    });

    const reporte = {};

    // Procesar estudiantes únicos por curso
    estudiantesUnicos.forEach((matricula) => {
      const estudiante = matricula.ESTUDIANTE;
      const { sexo } = estudiante.PERSONA;
      const { DETALLENIVELPARALELO } = matricula.DETALLEMATERIA;

      const curso = `${DETALLENIVELPARALELO.NIVEL.nivel} "${DETALLENIVELPARALELO.PARALELO.paralelo}" - ${DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad}`;

      if (!reporte[curso]) {
        reporte[curso] = {
          curso,
          nivel: DETALLENIVELPARALELO.NIVEL.nivel.toLowerCase(),
          paralelo: DETALLENIVELPARALELO.PARALELO.paralelo.toLowerCase(),
          especialidad:
            DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad.toLowerCase(),
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

    // Convertir el reporte en una lista y ordenar los resultados
    const resultado = Object.values(reporte)
      .map(({ estudiantes, ...datos }) => datos) // Eliminar la propiedad "estudiantes"
      .sort((a, b) => {
        // Ordenar por nivel, paralelo y especialidad
        const nivelesOrden = [
          "octavo",
          "noveno",
          "décimo",
          "primero de bachillerato",
          "segundo de bachillerato",
          "tercero de bachillerato",
        ];

        const nivelA = nivelesOrden.indexOf(a.nivel);
        const nivelB = nivelesOrden.indexOf(b.nivel);

        if (nivelA !== nivelB) {
          return nivelA - nivelB;
        }

        const paraleloA = a.paralelo;
        const paraleloB = b.paralelo;
        if (paraleloA !== paraleloB) {
          return paraleloA.localeCompare(paraleloB);
        }

        return a.especialidad.localeCompare(b.especialidad);
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
