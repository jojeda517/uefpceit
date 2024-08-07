import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const titulos = await prisma.tITULO.findMany({
      include: {
        DETALLEDOCENTETITULO: true,
      },
    });
    return NextResponse.json(titulos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los títulos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { titulo } = data;

    if (!titulo) {
      return NextResponse.json(
        { message: "El título es requerido" },
        { status: 400 }
      );
    }

    let tituloExistente = await prisma.tITULO.findUnique({
      where: { titulo },
    });

    if (!tituloExistente) {
      tituloExistente = await prisma.tITULO.create({
        data: { titulo },
      });
      return NextResponse.json(
        { message: "El título se agrego", titulo: tituloExistente },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "El título ya existe", titulo: tituloExistente },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear el título:", error);
    return NextResponse.json(
      { message: "Error al crear el título", error: error.message },
      { status: 500 }
    );
  }
}
