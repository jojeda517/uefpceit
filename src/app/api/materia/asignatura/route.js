import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const asignaturas = await prisma.mATERIA.findMany();
    return NextResponse.json(asignaturas);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las asignaturas" },
      { status: 500 }
    );
  }
}
