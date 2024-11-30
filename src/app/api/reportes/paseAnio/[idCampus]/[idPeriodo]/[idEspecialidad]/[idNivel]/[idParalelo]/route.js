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
            PERSONA: true, // Información personal del estudiante
          },
        },
        CALIFICACION: {
          include: {
            APORTE: true,
            EXAMEN: true,
            CONDUCTA: true,
          },
        },
        SUPLETORIO: true,
      },
    });

    // Agrupar por estudiante y calcular promedios
    const estudiantes = {};

    matriculas.forEach((matricula) => {
      const { ESTUDIANTE, CALIFICACION, SUPLETORIO, retirado } = matricula;
      const estudianteId = ESTUDIANTE.id;

      if (!estudiantes[estudianteId]) {
        estudiantes[estudianteId] = {
          estudiante: `${ESTUDIANTE.PERSONA.nombre} ${ESTUDIANTE.PERSONA.apellido}`,
          promediosMaterias: [],
          conductaTotal: 0,
          cantidadConducta: 0,
          retirado,
        };
      }

      // Calcular el promedio de la materia
      const promedioParciales =
        CALIFICACION.reduce((acc, cal) => acc + (cal.promedio || 0), 0) /
        Math.max(CALIFICACION.length, 1);

      // Considerar supletorio si existe
      const promedioMateria = SUPLETORIO
        ? (promedioParciales + SUPLETORIO.nota) / 2
        : promedioParciales;

      estudiantes[estudianteId].promediosMaterias.push(promedioMateria);

      // Sumar conducta
      const promedioConducta =
        CALIFICACION.reduce(
          (acc, cal) => acc + (cal.CONDUCTA[0]?.puntaje || 0),
          0
        ) / Math.max(CALIFICACION.length, 1);

      estudiantes[estudianteId].conductaTotal += promedioConducta;
      estudiantes[estudianteId].cantidadConducta += 1;
    });

    // Construir el reporte consolidado
    const reporte = Object.values(estudiantes).map((est) => {
      if (est.retirado) {
        return {
          estudiante: est.estudiante,
          promedioGeneral: "0.00",
          conducta: "0.00",
          estado: "RETIRADO",
        };
      }

      const promedioGeneral =
        est.promediosMaterias.reduce((acc, prom) => acc + prom, 0) /
        Math.max(est.promediosMaterias.length, 1);

      const conductaPromedio =
        est.cantidadConducta > 0
          ? est.conductaTotal / est.cantidadConducta
          : 0;

      const estado = promedioGeneral >= 7 ? "APROBADO" : "REPROBADO";

      return {
        estudiante: est.estudiante,
        promedioGeneral: promedioGeneral.toFixed(2),
        conducta: conductaPromedio.toFixed(2),
        estado,
      };
    });

    return NextResponse.json(reporte);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del reporte" },
      { status: 500 }
    );
  }
}
