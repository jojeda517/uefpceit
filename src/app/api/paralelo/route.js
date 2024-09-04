import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid"; // Importa la librería para generar UUIDs

export async function GET() {
  try {
    const result = await prisma.cAMPUS.findMany({
      include: {
        DETALLECAMPUSESPECIALIDAD: {
          include: {
            ESPECIALIDAD: {
              include: {
                DETALLEESPECIALIDADNIVEL: {
                  include: {
                    NIVEL: {
                      include: {
                        DETALLENIVELPARALELO: {
                          include: {
                            PARALELO: true,
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

    // Formateo de los datos con un `id` único para cada fila
    const formattedData = [];

    result.forEach((campus) => {
      campus.DETALLECAMPUSESPECIALIDAD.forEach((detalleEspecialidad) => {
        detalleEspecialidad.ESPECIALIDAD.DETALLEESPECIALIDADNIVEL.forEach(
          (detalleNivel) => {
            // Utiliza un objeto para asegurarte de que los paralelos sean únicos
            const paralelosUnicos = {};

            detalleNivel.NIVEL.DETALLENIVELPARALELO.forEach((np) => {
              // Verifica si el paralelo pertenece al nivel, especialidad y campus actuales
              if (
                np.idCampusPertenece === campus.id &&
                np.idEspecialidadPertenece ===
                  detalleEspecialidad.ESPECIALIDAD.id
              ) {
                const paraleloId = np.PARALELO.id;

                if (!paralelosUnicos[paraleloId]) {
                  paralelosUnicos[paraleloId] = {
                    id: paraleloId,
                    nombre: np.PARALELO.paralelo,
                  };
                }
              }
            });

            formattedData.push({
              id: uuidv4(), // Genera un `id` único para cada fila
              campus: {
                id: campus.id,
                nombre: campus.nombre,
              },
              especialidad: {
                id: detalleEspecialidad.ESPECIALIDAD.id,
                nombre: detalleEspecialidad.ESPECIALIDAD.especialidad,
              },
              nivel: {
                id: detalleNivel.NIVEL.id,
                nombre: detalleNivel.NIVEL.nivel,
              },
              paralelos: Object.values(paralelosUnicos), // Convierte el objeto de paralelos únicos en un array
            });
          }
        );
      });
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los paralelos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (
      !body.idCampusPertenece ||
      !body.idEspecialidadPertenece ||
      !body.idNivelPertenece
    ) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // Buscar paralelos ya asignados
    const paralelosAsignados = await prisma.dETALLENIVELPARALELO.findMany({
      where: {
        idCampusPertenece: parseInt(body.idCampusPertenece, 10),
        idEspecialidadPertenece: parseInt(body.idEspecialidadPertenece, 10),
        idNivelPertenece: parseInt(body.idNivelPertenece, 10),
      },
      select: {
        PARALELO: {
          select: {
            paralelo: true, // Obtén el nombre del paralelo asignado
          },
        },
      },
    });

    // Obtener todos los paralelos disponibles
    const todosLosParalelos = await prisma.pARALELO.findMany({
      select: {
        paralelo: true, // Obtén el nombre del paralelo
        id: true, // Obtén el ID del paralelo
      },
    });

    // Determinar el próximo paralelo disponible
    const paralelosDisponibles = todosLosParalelos.map((p) => p.paralelo); // Crear lista de paralelos disponibles
    const paralelosAsignadosList = paralelosAsignados.map(
      (p) => p.PARALELO.paralelo
    ); // Obtener paralelos ya asignados
    const nextParalelo = paralelosDisponibles.find(
      (p) => !paralelosAsignadosList.includes(p)
    ); // Buscar el próximo paralelo no asignado

    if (!nextParalelo) {
      return NextResponse.json(
        { message: "No hay paralelos disponibles" },
        { status: 400 }
      );
    }

    // Obtener el ID del próximo paralelo disponible
    const paraleloData = await prisma.pARALELO.findUnique({
      where: {
        paralelo: nextParalelo,
      },
      select: {
        id: true, // Obtener el ID del paralelo
      },
    });

    // Crear nuevo registro con el paralelo asignado
    await prisma.dETALLENIVELPARALELO.create({
      data: {
        idCampusPertenece: parseInt(body.idCampusPertenece, 10),
        idEspecialidadPertenece: parseInt(body.idEspecialidadPertenece, 10),
        idNivelPertenece: parseInt(body.idNivelPertenece, 10),
        idParaleloPertenece: parseInt(paraleloData.id, 10), // Usar el ID del paralelo
      },
    });

    return NextResponse.json(
      { message: "Paralelo asignado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear un paralelo:", error);
    return NextResponse.json(
      { message: "Error al crear un paralelo" },
      { status: 500 }
    );
  }
}
