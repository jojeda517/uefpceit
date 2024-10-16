import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  const result = await prisma.dOCENTE.findMany({
    where: {
      MATRICULA: {
        some: {
          PERIODO: {
            estado: true, // Filtrar por el periodo activo
          },
        },
      },
    },
    select: {
      PERSONA: {
        select: {
          nombre: true,
          apellido: true,
          foto: true,
          usuario: {
            select: {
              correo: true,
            },
          },
        },
      },
      MATRICULA: {
        select: {
          id: true,
          PERIODO: {
            select: {
              nombre: true, // Nombre del periodo
            },
          },
          DETALLEMATERIA: {
            select: {
              MATERIA: {
                select: {
                  nombre: true, // Nombre de la materia
                },
              },
              DETALLENIVELPARALELO: {
                select: {
                  NIVEL: {
                    select: {
                      nivel: true,
                    },
                  },
                  PARALELO: {
                    select: {
                      paralelo: true,
                    },
                  },
                  CAMPUSESPECIALIDAD: {
                    select: {
                      ESPECIALIDAD: {
                        select: {
                          especialidad: true,
                        },
                      },
                      CAMPUS: {
                        select: {
                          nombre: true, // Nombre del campus
                        },
                      },
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

  // Utilizar un set para almacenar claves únicas (materia, nivel, paralelo, especialidad, docente)
  const uniqueResult = new Map();

  result.forEach((docente) => {
    docente.MATRICULA.forEach((matricula) => {
      const key = `${docente.PERSONA.nombre}-${docente.PERSONA.apellido}-${matricula.DETALLEMATERIA.MATERIA.nombre}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo}-${matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad}`;

      if (!uniqueResult.has(key)) {
        uniqueResult.set(key, {
          id: matricula.id,
          PERSONA: docente.PERSONA,
          MATERIA: matricula.DETALLEMATERIA.MATERIA.nombre,
          NIVEL: matricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel,
          PARALELO:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO.paralelo,
          ESPECIALIDAD:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
              .ESPECIALIDAD.especialidad,
          CAMPUS:
            matricula.DETALLEMATERIA.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD
              .CAMPUS.nombre,
          PERIODO: matricula.PERIODO.nombre, // Nombre del periodo
        });
      }
    });
  });

  // Convertir los valores del Map en un array para la respuesta final
  const filteredResult = Array.from(uniqueResult.values());

  return NextResponse.json(filteredResult);
}

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
    const updateDocente = await prisma.mATRICULA.updateMany({
      where: {
        idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
        idDetalleMateriaPertenece: detalleMateria.id,
      },
      data: {
        idDocentePertenece: parseInt(body.idDocentePertenece),
      },
    });

    return NextResponse.json(
      { message: "Se actualizó la matrícula del docente" },
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
