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
        // Obtiene el id de matrícula
        const matricula = await prisma.mATRICULA.findFirst({
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
          },
        });

        return {
          idMatriculaPertenece: matricula.id,
          idEstudiantePertenece: calificacion.idEstudiante,
          promedio: calificacion.promedio,
          aportes: calificacion.aportes,
          examen: calificacion.examenes,
        };
      })
    );

    // Crear las calificaciones

    console.log(calificacionesData);
    return NextResponse.json(calificacionesData);
  } catch (error) {
    console.error("Error al calificar el curso:", error);
    return NextResponse.json(
      { message: "Error al calificar el curso", error: error.message },
      { status: 500 }
    );
  }
}
