import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const modalidades = await prisma.mODALIDAD.findMany();
    return NextResponse.json(modalidades);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las modalidades" },
      { status: 500 }
    );
  }
}
