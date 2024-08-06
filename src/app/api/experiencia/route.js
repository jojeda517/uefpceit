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

export async function POST(request) {
  try {
    const data = await request.json();
    const experiencia = await prisma.eXPERIENCIA.create({
      data,
    });
    return NextResponse.json(experiencia, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear la experiencia" },
      { status: 500 }
    );
  }
}
