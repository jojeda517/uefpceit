import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idPersona } = params;

  try {
    // Obtener información del docente
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

    // Contar estudiantes únicos (sin duplicados)
    const countEstudiantes = await prisma.mATRICULA.findMany({
      distinct: ["idEstudiantePertenece"],
    });

    // Contar docentes únicos (sin duplicados)
    const countDocentes = await prisma.mATRICULA.findMany({
      distinct: ["idDocentePertenece"],
    });

    // Construir la respuesta
    const response = {
      persona: docente.PERSONA,
      estadisticas: {
        countEstudiantes: countEstudiantes.length,
        countDocentes: countDocentes.length,
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
