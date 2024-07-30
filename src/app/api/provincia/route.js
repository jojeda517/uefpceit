import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const provincias = await prisma.pROVINCIA.findMany({
      include: {
        CANTON: {
          include: {
            PARROQUIA: true,
          },
        },
      },
    });
    return NextResponse.json(provincias);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las provincias" },
      { status: 500 }
    );
  }
}
