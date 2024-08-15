import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

export async function GET(request, { params }) {
  try {
    const evaluacion = await prisma.eVALUACION.findMany({
      where: {
        idMetodoEvaluacionPertenece: parseInt(params.id),
      },
    });
    return NextResponse.json(evaluacion);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las evaluaciones" },
      { status: 500 }
    );
  }
}
