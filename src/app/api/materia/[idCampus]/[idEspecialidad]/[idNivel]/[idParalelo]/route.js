import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idCampus, idEspecialidad, idNivel, idParalelo } = params;
  try {
    const detallesNivelParalelo = await prisma.DETALLENIVELPARALELO.findMany({
      where: {
        idCampusPertenece: parseInt(idCampus),
        idEspecialidadPertenece: parseInt(idEspecialidad),
        idNivelPertenece: parseInt(idNivel),
        idParaleloPertenece: parseInt(idParalelo),
      },
      select: {
        DETALLEMATERIA: {
          select: {
            MATERIA: true,
          },
        },
      },
    });

    // Usar un Set para evitar duplicados
    const materiaSet = new Set();
    const materias = [];

    detallesNivelParalelo.forEach((detalle) => {
      detalle.DETALLEMATERIA.forEach((detalleMateria) => {
        const materia = detalleMateria.MATERIA;
        // Solo agregar si no está ya en el Set
        if (!materiaSet.has(materia.id)) {
          materiaSet.add(materia.id);
          materias.push(materia);
        }
      });
    });

    return NextResponse.json(materias);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener datos de las asignaturas" },
      { status: 500 }
    );
  }
}
