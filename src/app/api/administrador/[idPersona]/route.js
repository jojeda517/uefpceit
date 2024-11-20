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
                  where: {
                    PERIODO: {
                      estado: true, // Filtrar donde el PERIODO tenga estado = true
                    },
                  },
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
      where: {
        PERIODO: {
          estado: true, // Filtrar donde el PERIODO tenga estado = true
        },
      },
      distinct: ["idEstudiantePertenece"],
    });

    // Contar docentes únicos (sin duplicados)
    const countDocentes = await prisma.mATRICULA.findMany({
      where: {
        PERIODO: {
          estado: true, // Filtrar donde el PERIODO tenga estado = true
        },
      },
      distinct: ["idDocentePertenece"],
    });

    // Contar los cursos con estudiantes matriculados
    const cursosConEstudiantes = await prisma.mATRICULA.findMany({
      where: {
        PERIODO: {
          estado: true, // Filtrar donde el PERIODO tenga estado = true
        },
      },
      select: {
        DETALLEMATERIA: {
          select: {
            DETALLENIVELPARALELO: {
              select: {
                id: true,
              },
            }, // Incluir los niveles y paralelos asociados
          },
        },
      },
    });

    // Filtrar los cursos únicos
    const cursosUnicos = cursosConEstudiantes.map(
      (curso) => curso.DETALLEMATERIA.DETALLENIVELPARALELO.id
    );

    // Contar los cursos únicos
    const countCursos = [...new Set(cursosUnicos)].length;

    // Contar las especialidades con estudiantes matriculados
    const especialidadesConEstudiantes = await prisma.mATRICULA.findMany({
      select: {
        DETALLEMATERIA: {
          select: {
            DETALLENIVELPARALELO: {
              select: {
                idEspecialidadPertenece: true,
              },
            },
          },
        },
      },
    });

    // Filtrar las especialidades únicas
    const especialidadesUnicas = especialidadesConEstudiantes.map(
      (especialidad) =>
        especialidad.DETALLEMATERIA.DETALLENIVELPARALELO.idEspecialidadPertenece
    );

    // Contar las especialidades únicas
    const countEspecialidades = [...new Set(especialidadesUnicas)].length;

    // Construir la respuesta
    const response = {
      persona: docente.PERSONA,
      estadisticas: {
        countEstudiantes: countEstudiantes.length,
        countDocentes: countDocentes.length,
        countCursos: countCursos,
        countEspecialidades: countEspecialidades,
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
