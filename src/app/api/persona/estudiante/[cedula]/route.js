import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

// GET para obtener los datos de la persona
export async function GET(request, { params }) {
  try {
    // Buscar la persona e incluir la información del usuario
    const persona = await prisma.pERSONA.findUnique({
      where: {
        cedula: params.cedula,
      },
      include: {
        usuario: true,
        campus: true, // Incluye la información del campus
        parroquia: {
          include: {
            CANTON: {
              include: {
                PROVINCIA: true, // Incluye la información de la provincia
              },
            },
          },
        },
        estudiante: {
          include: {
            DETALLE_DISCAPACIDAD: {
              include: {
                Discapacidad: true,
              },
            },
            ESTADO_CIVIL: true,
            ETNIA: true,
            REPRESENTANTE: true,
          },
        },
      },
    });

    if (!persona) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(persona);
  } catch (error) {
    return NextResponse.error({
      status: 500,
      statusText: "Internal Server Error",
      body: {
        error: "Error al obtener la persona",
      },
    });
  }
}
