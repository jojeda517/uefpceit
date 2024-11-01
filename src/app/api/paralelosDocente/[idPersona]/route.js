import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid";

export async function GET(request, { params }) {
  const { idPersona } = params;

  try {
    // Obtener el ID del docente a partir de la persona
    const docente = await prisma.dOCENTE.findUnique({
      where: { idPersonaPertenece: parseInt(idPersona) },
      select: { id: true },
    });

    if (!docente) {
      return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });
    }

    // Obtener los datos relacionados con la matrícula del docente
    const result = await prisma.mATRICULA.findMany({
      where: { idDocentePertenece: docente.id },
      select: {
        DETALLEMATERIA: {
          select: {
            MATERIA: true,
            DETALLENIVELPARALELO: {
              select: {
                PARALELO: true,
                NIVEL: true,
                CAMPUSESPECIALIDAD: {
                  select: {
                    CAMPUS: true,
                    ESPECIALIDAD: true,
                  },
                },
              },
            },
          },
        },
        PERIODO: true,
      },
    });

    if (!result.length) {
      return NextResponse.json({ message: "No se encontraron registros para el docente" }, { status: 404 });
    }

    // Eliminar duplicados y agregar un ID único a cada objeto
    const uniqueResult = Array.from(
      new Set(result.map((item) => JSON.stringify(item)))
    )
    .map((item) => ({ id: uuidv4(), ...JSON.parse(item) }));

    return NextResponse.json(uniqueResult, { status: 200 });

  } catch (error) {
    console.error("Error al obtener datos del docente:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los datos del docente" },
      { status: 500 }
    );
  }
}
