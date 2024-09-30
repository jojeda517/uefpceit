import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// Get los niveles de una especialidad
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validar que el id sea un número entero válido
    const especialidadId = parseInt(id);
    if (isNaN(especialidadId)) {
      return NextResponse.json(
        { error: "Invalid id parameter" },
        { status: 400 }
      );
    }

    // Obtener niveles de una especialidad de la base de datos
    const niveles = await prisma.nIVEL.findMany({
      where: {
        DETALLEESPECIALIDADNIVEL: {
          some: {
            idEspecialidadPertenece: especialidadId,
          },
        },
      },
      include: {
        DETALLEESPECIALIDADNIVEL: true,
      },
    });
    return NextResponse.json(niveles);
  } catch (error) {
    console.error("Error fetching niveles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
