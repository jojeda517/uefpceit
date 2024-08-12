import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// GET para obtener los datos de la persona
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validar que el id sea un número entero válido
    const cantonId = parseInt(id);
    if (isNaN(cantonId)) {
      return NextResponse.json(
        { error: "Invalid id parameter" },
        { status: 400 }
      );
    }

    // Obtener parroquias de la base de datos
    const parroquias = await prisma.pARROQUIA.findMany({
      where: {
        idCantonPertenece: cantonId,
      },
    });

    // Verificar si se encontraron parroquias
    if (!parroquias.length) {
      return NextResponse.json(
        { error: "No parroquias found" },
        { status: 404 }
      );
    }

    return NextResponse.json(parroquias);
  } catch (error) {
    console.error("Error fetching parroquias:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
