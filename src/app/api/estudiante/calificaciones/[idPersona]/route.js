import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idPersona } = params;
  try {
    const estudiante = await prisma.mATRICULA.findMany({
      where: {
        ESTUDIANTE: {
          idPersonaPertenece: parseInt(idPersona),
        },
        PERIODO: {
          estado: true,
        },
      },
      include: {
        DETALLEMATERIA: {
          select: {
            MATERIA: {
              select: {
                nombre: true,
              },
            },
          },
        },
        CALIFICACION: {
          include: {
            APORTE: {
              orderBy: {
                id: "asc", // Ordena los aportes por 'id' de manera ascendente
              },
            },
            EXAMEN: true,
            ASISTENCIA: true,
            CONDUCTA: true,
          },
        },
        SUPLETORIO: true,
        PERIODO: {
          select: {
            evaluacion: true,
          },
        },
      },
      orderBy: {
        DETALLEMATERIA: {
          MATERIA: {
            nombre: "asc",
          },
        },
      },
    });
    return NextResponse.json(estudiante);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
