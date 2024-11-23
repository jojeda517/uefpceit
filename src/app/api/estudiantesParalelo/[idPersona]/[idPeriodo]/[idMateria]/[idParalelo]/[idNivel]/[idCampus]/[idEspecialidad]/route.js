import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  // Extraer y convertir parámetros a enteros
  const {
    idPersona,
    idPeriodo,
    idMateria,
    idParalelo,
    idNivel,
    idCampus,
    idEspecialidad,
  } = params;
  const docente = await prisma.dOCENTE.findUnique({
    where: { idPersonaPertenece: parseInt(idPersona) },
  });

  const idDocente = docente.id;

  const ids = {
    idDocente: Number(idDocente),
    idPeriodo: Number(idPeriodo),
    idMateria: Number(idMateria),
    idParalelo: Number(idParalelo),
    idNivel: Number(idNivel),
    idCampus: Number(idCampus),
    idEspecialidad: Number(idEspecialidad),
  };

  // Validar que todos los IDs sean enteros válidos
  if (Object.values(ids).some(isNaN)) {
    return NextResponse.json(
      { error: "Invalid or missing parameters" },
      { status: 400 }
    );
  }

  try {
    const datos = await prisma.eSTUDIANTE.findMany({
      where: {
        MATRICULA: {
          some: {
            idDocentePertenece: ids.idDocente,
            idPeriodoPertenece: ids.idPeriodo,
            DETALLEMATERIA: {
              idMateriaPertenece: ids.idMateria,
              DETALLENIVELPARALELO: {
                idParaleloPertenece: ids.idParalelo,
                idNivelPertenece: ids.idNivel,
                idCampusPertenece: ids.idCampus,
                idEspecialidadPertenece: ids.idEspecialidad,
              },
            },
          },
        },
      },
      include: {
        PERSONA: true,
        MATRICULA: {
          where: {
            idDocentePertenece: ids.idDocente,
            idPeriodoPertenece: ids.idPeriodo,
            DETALLEMATERIA: {
              idMateriaPertenece: ids.idMateria,
              DETALLENIVELPARALELO: {
                idParaleloPertenece: ids.idParalelo,
                idNivelPertenece: ids.idNivel,
                idCampusPertenece: ids.idCampus,
                idEspecialidadPertenece: ids.idEspecialidad,
              },
            },
          },
          include: {
            CALIFICACION: {
              include: {
                APORTE: {
                  orderBy: {
                    id: "asc", // Ordenar los aportes por 'id' en orden ascendente
                  },
                },
                EXAMEN: true,
                ASISTENCIA: true,
                CONDUCTA: true,
                PARCIAL: {
                  include: {
                    CIERREFASE: true,
                  },
                },
              },
            },
            SUPLETORIO: true,
          },
        },
      },
      orderBy: {
        PERSONA: {
          apellido: "asc", // Ordenar por apellido en orden ascendente
        },
      },
    });

    return NextResponse.json(datos, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Error fetching student data" },
      { status: 500 }
    );
  }
}
