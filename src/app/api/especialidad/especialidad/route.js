import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const especialidades = await prisma.eSPECIALIDAD.findMany();
    return NextResponse.json(especialidades);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las especialidades" },
      { status: 500 }
    );
  }
}
