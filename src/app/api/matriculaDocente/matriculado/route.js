import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (
      !body.idCampusPertenece ||
      !body.idDocentePertenece ||
      !body.idPeriodoPertenece ||
      !body.idEspecialidadPertenece ||
      !body.idNivelPertenece ||
      !body.idParaleloPertenece ||
      !body.idMateriaPertenece
    ) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // 1. Obtener el detalle del nivel-paralelo-especialidad
    const detalleNivelParalelo = await prisma.dETALLENIVELPARALELO.findFirst({
      where: {
        idCampusPertenece: parseInt(body.idCampusPertenece),
        idEspecialidadPertenece: parseInt(body.idEspecialidadPertenece),
        idNivelPertenece: parseInt(body.idNivelPertenece),
        idParaleloPertenece: parseInt(body.idParaleloPertenece),
      },
      include: {
        CAMPUSESPECIALIDAD: {
          select: {
            CAMPUS: true,
          },
        },
      },
    });

    if (!detalleNivelParalelo) {
      return res.status(404).json({
        message:
          "No se encontró el detalle del nivel-paralelo para la especialidad y campus proporcionados.",
      });
    }

    // 2. Obtener el detalleMateria a la que pertenece
    const detalleMateria = await prisma.dETALLEMATERIA.findFirst({
      where: {
        idDetalleNivelParaleloPertenece: detalleNivelParalelo.id,
        idMateriaPertenece: parseInt(body.idMateriaPertenece),
      },
    });

    if (!detalleMateria) {
      return res.status(404).json({
        message:
          "No se encontro la materia para el nivel, paralelo y especialidad seleccionados.",
      });
    }

    // 3. Actualizar la matricula del docente con el detalleMateria obtenido
    const matricula = await prisma.mATRICULA.findMany({
      where: {
        idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
        idDetalleMateriaPertenece: detalleMateria.id,
        idDocentePertenece: {
          not: null, // Asegura que idDocentePertenece no sea null
        },
      },
    });

    return NextResponse.json(
      { message: "La materia ya tiene docente asignado" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener datos de los paralelos" },
      { status: 500 }
    );
  }
}
