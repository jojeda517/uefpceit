import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(_, { params }) {
  try {
    const { idCampus, idPeriodo, idEspecialidad, idNivel, idParalelo } = params;

    if (!idCampus || !idPeriodo || !idEspecialidad || !idNivel || !idParalelo) {
      return NextResponse.json(
        { message: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    const campusId = parseInt(idCampus);
    const periodoId = parseInt(idPeriodo);
    const especialidadId = parseInt(idEspecialidad);
    const nivelId = parseInt(idNivel);
    const paraleloId = parseInt(idParalelo);

    // Consulta las matrículas filtradas
    const matriculas = await prisma.mATRICULA.findMany({
      where: {
        idPeriodoPertenece: periodoId,
        DETALLEMATERIA: {
          DETALLENIVELPARALELO: {
            idCampusPertenece: campusId,
            idEspecialidadPertenece: especialidadId,
            idNivelPertenece: nivelId,
            idParaleloPertenece: paraleloId,
          },
        },
      },
      include: {
        ESTUDIANTE: {
          include: {
            PERSONA: {
              include: {
                parroquia: {
                  select: {
                    CANTON: {
                      select: {
                        canton: true,
                      },
                    },
                  },
                },
              },
            }, // Información personal del estudiante
          },
        },
      },
    });

    // Filtrar duplicados basándose en el ID del estudiante
    const estudiantesUnicos = {};
    const resultadoFiltrado = matriculas.filter((matricula) => {
      const estudianteId = matricula.ESTUDIANTE.id;
      if (!estudiantesUnicos[estudianteId]) {
        estudiantesUnicos[estudianteId] = true;
        return true;
      }
      return false;
    });

    return NextResponse.json(resultadoFiltrado);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del reporte" },
      { status: 500 }
    );
  }
}
