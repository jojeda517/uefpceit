import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// Get las especialidades de un campus
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validar que el id sea un número entero válido
    const campusId = parseInt(id);
    if (isNaN(campusId)) {
      return NextResponse.json(
        { error: "Invalid id parameter" },
        { status: 400 }
      );
    }

    // Obtener especialidades de un campus de la base de datos
    const especialidades = await prisma.eSPECIALIDAD.findMany({
      where: {
        DETALLECAMPUSESPECIALIDAD: {
          some: {
            idCampusPertenece: campusId,
          },
        },
      },
      include: {
        DETALLECAMPUSESPECIALIDAD: true,
      },
    });
    return NextResponse.json(especialidades);
  } catch (error) {
    console.error("Error fetching especialidades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
