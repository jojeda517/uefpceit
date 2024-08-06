import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const titulos = await prisma.tITULO.findMany({
      include: {
        DETALLEDOCENTETITULO: true,
      },
    });
    return NextResponse.json(titulos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los títulos" },
      { status: 500 }
    );
  }
}
