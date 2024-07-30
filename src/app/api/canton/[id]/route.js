import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// GET para obtener los datos de la persona
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validar que el id sea un número entero válido
    const provinciaId = parseInt(id);
    if (isNaN(provinciaId)) {
      return NextResponse.json(
        { error: "Invalid id parameter" },
        { status: 400 }
      );
    }

    // Obtener cantones de la base de datos
    const cantones = await prisma.cANTON.findMany({
      where: {
        idProvinciaPertenece: provinciaId,
      },
    });

    // Verificar si se encontraron cantones
    if (!cantones.length) {
      return NextResponse.json({ error: "No cantones found" }, { status: 404 });
    }

    return NextResponse.json(cantones);
  } catch (error) {
    console.error("Error fetching cantones:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
