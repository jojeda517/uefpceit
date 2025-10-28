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

    // Consulta las matrículas con sus relaciones
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
        DETALLEMATERIA: {
          include: {
            MATERIA: true, // Nombre de la materia
          },
        },
        CALIFICACION: {
          include: {
            APORTE: true,
            EXAMEN: true,
            ASISTENCIA: true,
            CONDUCTA: true,
            PARCIAL: true, // Información del parcial
          },
        },
      },
    });

    // Construcción del reporte por estudiante
    const reporte = {};

    matriculas.forEach((matricula) => {
      const { ESTUDIANTE, DETALLEMATERIA, CALIFICACION } = matricula;
      const estudianteId = ESTUDIANTE.id;

      if (!reporte[estudianteId]) {
        reporte[estudianteId] = {
          estudiante: `${ESTUDIANTE.PERSONA.nombre} ${ESTUDIANTE.PERSONA.apellido}`,
          cedula: ESTUDIANTE.PERSONA.cedula,
          materias: {},
        };
      }

      const materia = DETALLEMATERIA.MATERIA.nombre;

      if (!reporte[estudianteId].materias[materia]) {
        reporte[estudianteId].materias[materia] = [];
      }

      const notasParciales = CALIFICACION.map((calificacion) => {
        const aportes =
          calificacion.APORTE.length > 0
            ? calificacion.APORTE.map((aporte) => aporte.aporte)
            : [0, 0, 0]; // Si no hay aportes, asumimos 0, 0, 0
        const examen = calificacion.EXAMEN[0]?.nota || 0; // Si no hay examen, asumimos 0
        const conducta = calificacion.CONDUCTA[0]?.puntaje || 0; // Si no hay conducta, asumimos 0
        const asistencia = calificacion.ASISTENCIA[0]?.porcentaje || 0; // Si no hay asistencia, asumimos 0

        // Calcular promedio usando 70% aportes y 30% examen
        const promedioAportes = aportes.reduce((acc, a) => acc + a, 0) / aportes.length || 0;
        const promedio = promedioAportes * 0.7 + examen * 0.3;

        return {
          parcial: calificacion.PARCIAL.parcial,
          aportes,
          examen,
          conducta,
          asistencia,
          promedio: promedio.toFixed(2),
        };
      });

      reporte[estudianteId].materias[materia].push(...notasParciales);
    });

    // Calcular el promedio general por materia y consolidar el reporte
    const resultado = Object.values(reporte).map((est) => {
      const materias = Object.entries(est.materias).map(([materia, parciales]) => {
        const promedioGeneral =
          parciales.length > 0
            ? parciales.reduce((acc, p) => acc + parseFloat(p.promedio), 0) / parciales.length
            : 0;

        const promedioConducta =
          parciales.length > 0
            ? parciales.reduce((acc, p) => acc + parseFloat(p.conducta), 0) / parciales.length
            : 0;

        const promedioAsistencia =
          parciales.length > 0
            ? parciales.reduce((acc, p) => acc + parseFloat(p.asistencia), 0) / parciales.length
            : 0;

        return {
          materia,
          parciales,
          promedioGeneral: promedioGeneral.toFixed(2),
          promedioConducta: promedioConducta.toFixed(2),
          promedioAsistencia: promedioAsistencia.toFixed(2),
        };
      });

      return {
        estudiante: est.estudiante,
        cedula: est.cedula,
        materias,
      };
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del reporte" },
      { status: 500 }
    );
  }
}
