import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const estadosCiviles = await prisma.eSTADOCIVIL.findMany();
    return NextResponse.json(estadosCiviles);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los estados civiles." },
      { status: 500 }
    );
  }
}
