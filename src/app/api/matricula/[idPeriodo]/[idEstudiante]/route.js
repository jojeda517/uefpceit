import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  const { idPeriodo, idEstudiante } = params;
  const result = await prisma.mATRICULA.findMany({
    where: {
      idPeriodoPertenece: parseInt(idPeriodo),
      idEstudiantePertenece: parseInt(idEstudiante),
    },
  });

  return NextResponse.json(result);
}
