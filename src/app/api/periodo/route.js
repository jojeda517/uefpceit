import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const periodos = await prisma.pERIODO.findMany({
      include: {
        evaluacion: {
          include: {
            metodoEvaluacion: true,
          },
        },
        periodosModalidad: {
          include: {
            modalidad: true,
          },
        },
      },
    });
    return NextResponse.json(periodos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los periodos" },
      { status: 500 }
    );
  }
}
