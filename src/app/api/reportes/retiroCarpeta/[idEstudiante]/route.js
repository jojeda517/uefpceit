import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  try {
    const idEstudiante = parseInt(params.idEstudiante);

    if (isNaN(idEstudiante)) {
      return NextResponse.json(
        {
          message:
            "El parámetro 'Estudiante' no es válido.",
        },
        { status: 400 }
      );
    }

    const data = await prisma.mATRICULA.findFirst({
      where: {
        idEstudiantePertenece: idEstudiante,
      },
      orderBy: {
        idPeriodoPertenece: 'desc',
      },
      select: {
        PERIODO: {
          select: { nombre: true },
        },
        ESTUDIANTE: {
          select: {
            PERSONA: {
              select: {
                nombre: true,
                apellido: true,
                cedula: true,
              },
            },
          },
        },
        DETALLEMATERIA: {
          select: {
            DETALLENIVELPARALELO: {
              select: {
                NIVEL: {
                  select: { nivel: true },
                },
                PARALELO: {
                  select: { paralelo: true },
                },
                CAMPUSESPECIALIDAD: {
                  select: {
                    ESPECIALIDAD: {
                      select: { especialidad: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "No se encontró una matrícula con los datos proporcionados.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener la matrícula:", error);
    return NextResponse.json(
      {
        message:
          "Ocurrió un error inesperado al obtener los datos del estudiante. Intente nuevamente más tarde.",
      },
      { status: 500 }
    );
  }
}
