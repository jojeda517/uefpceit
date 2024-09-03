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
                np.idEspecialidadPertenece === detalleEspecialidad.ESPECIALIDAD.id
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
