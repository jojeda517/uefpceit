import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const metodoEvaluacion = await prisma.mETODOEVALUACION.findMany();
    return NextResponse.json(metodoEvaluacion);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los metodos de evaluación" },
      { status: 500 }
    );
  }
}
