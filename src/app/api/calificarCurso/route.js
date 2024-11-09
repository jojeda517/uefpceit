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

    // Esperamos a que todas las promesas se resuelvan con Promise.all
    const calificacionesData = await Promise.all(
      calificaciones.map(async (calificacion) => {
        // Obtiene todas las matrículas correspondientes
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
                id: true, // Selecciona solo el ID del estudiante
              },
            },
          },
        });

        // Encontrar la matrícula correspondiente al estudiante
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
        };
      })
    );

    console.log(calificacionesData);

    // Eliminar los registros de calificaciones, aportes y exámenes de ese parcial si ya existen
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

      await prisma.cALIFICACION.deleteMany({
        where: {
          idMatricula: calificacion.idMatriculaPertenece,
          idParcial: parseInt(idParcial),
        },
      });
    }

    // Crear las calificaciones, los aportes y exámenes para cada matrícula
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