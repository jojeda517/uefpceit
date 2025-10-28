import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      idDetalleMateriaPertenece,
      idPeriodoPertenece,
      idDocentePertenece,
      idParcial,
      calificaciones,
    } = data;

    // Procesar las calificaciones
    const calificacionesData = await Promise.all(
      calificaciones.map(async (calificacion) => {
        const matriculas = await prisma.mATRICULA.findMany({
          where: {
            idDocentePertenece: idDocentePertenece,
            DETALLEMATERIA: {
              id: idDetalleMateriaPertenece,
            },
            PERIODO: {
              id: idPeriodoPertenece,
            },
          },
          select: {
            id: true,
            ESTUDIANTE: {
              select: {
                id: true,
              },
            },
          },
        });

        const matricula = matriculas.find(
          (m) => m.ESTUDIANTE.id === calificacion.idEstudiante
        );

        if (!matricula) {
          throw new Error(
            `Matrícula no encontrada para el estudiante ${calificacion.idEstudiante}`
          );
        }

        return {
          idMatriculaPertenece: matricula.id,
          idEstudiantePertenece: calificacion.idEstudiante,
          promedio: calificacion.promedio,
          aportes: calificacion.aportes,
          examen: calificacion.examenes,
          asistencia: calificacion.asistencia || 0, // Asistencia (0 por defecto si no se envía)
          conducta: calificacion.conducta || 0, // Conducta (0 por defecto si no se envía)
        };
      })
    );

    console.log(calificacionesData);

    // Eliminar registros previos de calificaciones, aportes, exámenes, asistencias y conductas del parcial seleccionado
    for (const calificacion of calificacionesData) {
      await prisma.eXAMEN.deleteMany({
        where: {
          CALIFICACION: {
            idMatricula: calificacion.idMatriculaPertenece,
            idParcial: parseInt(idParcial),
          },
        },
      });

      await prisma.aPORTE.deleteMany({
        where: {
          CALIFICACION: {
            idMatricula: calificacion.idMatriculaPertenece,
            idParcial: parseInt(idParcial),
          },
        },
      });

      await prisma.aSISTENCIA.deleteMany({
        where: {
          CALIFICACION: {
            idMatricula: calificacion.idMatriculaPertenece,
            idParcial: parseInt(idParcial),
          },
        },
      });

      await prisma.cONDUCTA.deleteMany({
        where: {
          CALIFICACION: {
            idMatricula: calificacion.idMatriculaPertenece,
            idParcial: parseInt(idParcial),
          },
        },
      });

      await prisma.cALIFICACION.deleteMany({
        where: {
          idMatricula: calificacion.idMatriculaPertenece,
          idParcial: parseInt(idParcial),
        },
      });
    }

    // Crear las calificaciones, los aportes, exámenes, asistencias y conductas para cada matrícula
    for (const calificacion of calificacionesData) {
      const cal = await prisma.cALIFICACION.create({
        data: {
          idMatricula: parseInt(calificacion.idMatriculaPertenece),
          idParcial: parseInt(idParcial),
          promedio:
            calificacion.promedio === 0 ? 0 : parseFloat(calificacion.promedio),
          estado:
            parseFloat(calificacion.promedio) >= 7
              ? "APROBADO"
              : parseFloat(calificacion.promedio) <= 4
              ? "REPROBADO"
              : "SUSPENSO",
        },
      });

      // Crear los aportes para la calificación
      await Promise.all(
        calificacion.aportes.map((aporte) =>
          prisma.aPORTE.create({
            data: {
              idCalificacion: cal.id,
              aporte: aporte,
            },
          })
        )
      );

      // Crear el examen para la calificación
      await prisma.eXAMEN.create({
        data: {
          idCalificacion: cal.id,
          nota: calificacion.examen === 0 ? 0 : parseFloat(calificacion.examen),
        },
      });

      // Crear la asistencia para la calificación
      await prisma.aSISTENCIA.create({
        data: {
          idCalificacion: cal.id,
          porcentaje:
            calificacion.asistencia === 0
              ? 0
              : parseFloat(calificacion.asistencia),
        },
      });

      // Crear la conducta para la calificación
      await prisma.cONDUCTA.create({
        data: {
          idCalificacion: cal.id,
          puntaje:
            calificacion.conducta === 0 ? 0 : parseFloat(calificacion.conducta),
        },
      });
    }

    return NextResponse.json(calificacionesData);
  } catch (error) {
    console.error("Error al calificar el curso:", error);
    return NextResponse.json(
      { message: "Error al calificar el curso", error: error.message },
      { status: 500 }
    );
  }
}
