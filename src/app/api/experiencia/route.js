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
    const { institucion } = data;

    if (!institucion) {
      return NextResponse.json(
        { message: "La institución es requerida" },
        { status: 400 }
      );
    }

    let experienciaExistente = await prisma.eXPERIENCIA.findUnique({
      where: { institucion },
    });

    if (!experienciaExistente) {
      experienciaExistente = await prisma.eXPERIENCIA.create({
        data: { institucion },
      });
      return NextResponse.json(experienciaExistente, { status: 201 });
    }

    return NextResponse.json(
      {
        message: "La institución ya existe",
        institucion: experienciaExistente,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al crear la institución:", error);
    return NextResponse.json(
      { message: "Error al crear la institución", error: error.message },
      { status: 500 }
    );
  }
}
