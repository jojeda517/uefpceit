import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idPersona } = params;

  try {
    // Obtener información de la persona y el docente
    const docente = await prisma.dOCENTE.findUnique({
      where: { idPersonaPertenece: parseInt(idPersona) },
      include: {
        PERSONA: {
          include: {
            usuario: {
              select: {
                correo: true,
              },
            },
            campus: {
              select: {
                nombre: true,
              },
            },
            docente: {
              include: {
                DETALLEDOCENTETITULO: {
                  include: {
                    TITULO: {
                      select: {
                        titulo: true,
                      },
                    },
                  },
                },
                MATRICULA: {
                  select: {
                    PERIODO: {
                      select: {
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
            parroquia: {
              include: {
                CANTON: {
                  include: {
                    PROVINCIA: {
                      select: {
                        provincia: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!docente) {
      return NextResponse.json(
        { error: "Docente no encontrado" },
        { status: 404 }
      );
    }

    // Consultar las matrículas relacionadas con el docente
    const data = await prisma.mATRICULA.findMany({
      where: { idDocentePertenece: docente.id },
      include: {
        DETALLEMATERIA: {
          include: {
            MATERIA: true, // Asegurar que se obtenga el nombre de la materia
            DETALLENIVELPARALELO: {
              select: {
                id: true, // Identificador único de la relación nivel-paralelo
                NIVEL: { select: { nivel: true } },
                PARALELO: { select: { paralelo: true } },
              },
            },
          },
        },
      },
    });

    if (!data.length) {
      return NextResponse.json(
        { message: "No se encontraron registros para el docente" },
        { status: 404 }
      );
    }

    // Extraer cursos únicos a partir de DETALLENIVELPARALELO
    const cursosUnicos = new Set(
      data.map((item) => item.DETALLEMATERIA.DETALLENIVELPARALELO?.id)
    ).size;

    // Calcular el número único de materias desde la tabla DETALLEMATERIA
    const materiasUnicas = new Set(
      data.map((item) => item.DETALLEMATERIA.MATERIA?.nombre).filter(Boolean)
    ).size;

    // Calcular el número total de estudiantes
    const totalEstudiantes = data.length;

    // Construir la respuesta
    const response = {
      persona: docente.PERSONA,
      estadisticas: {
        cursosUnicos,
        totalEstudiantes,
        materiasUnicas,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos del docente:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los datos del docente" },
      { status: 500 }
    );
  }
}
