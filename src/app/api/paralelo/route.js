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
            const paralelos = detalleNivel.NIVEL.DETALLENIVELPARALELO.map(
              (np) => ({
                id: np.PARALELO.id, // Asegúrate de tener un `id` único para el paralelo
                nombre: np.PARALELO.paralelo,
              })
            );

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
              paralelos: paralelos,
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
