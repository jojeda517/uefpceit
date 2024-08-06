import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const experiencias = await prisma.eXPERIENCIA.findMany({
      include: {
        DETALLEDOCENTEEXPERIENCIA: true,
      },
    });
    return NextResponse.json(experiencias);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las experiencias" },
      { status: 500 }
    );
  }
}
