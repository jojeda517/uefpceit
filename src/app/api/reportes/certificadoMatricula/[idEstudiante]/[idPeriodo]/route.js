import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  try {
    const idPeriodo = parseInt(params.idPeriodo);
    const idEstudiante = parseInt(params.idEstudiante);

    if (isNaN(idPeriodo) || isNaN(idEstudiante)) {
      return NextResponse.json(
        {
          message:
            "Los parámetros 'idPeriodo' o 'idEstudiante' no son válidos.",
        },
        { status: 400 }
      );
    }

    const data = await prisma.mATRICULA.findFirst({
      where: {
        idPeriodoPertenece: idPeriodo,
        idEstudiantePertenece: idEstudiante,
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
                fechaNacimiento: true,
                nacionalidad: true,
                telefono: true,
                parroquia: {
                  select: {
                    CANTON: {
                      select: {
                        canton: true,
                      },
                    },
                  },
                },
              },
            },
            lugarNacimiento: true,
            nombreTrabajo: true,
            ESTADO_CIVIL: {
              select: {
                estadoCivil: true,
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
