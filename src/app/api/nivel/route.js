import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const nivel = await prisma.nIVEL.findMany();
    return NextResponse.json(nivel);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los niveles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.nivel) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // Validar que no exista un nivel con el mismo nombre si se envia el id
    if (!body.id) {
      const nivelExistente = await prisma.nIVEL.findFirst({
        where: {
          nivel: body.nivel.toLowerCase(),
        },
      });

      if (nivelExistente) {
        return NextResponse.json(
          { message: "Ya existe un nivel con el mismo nombre" },
          { status: 400 }
        );
      }
    } else {
      const nivelExistente = await prisma.nIVEL.findFirst({
        where: {
          nivel: body.nivel.toLowerCase(),
          id: {
            not: parseInt(body.id, 10),
          },
        },
      });

      if (nivelExistente) {
        return NextResponse.json(
          { message: "Ya existe un nivel con el mismo nombre" },
          { status: 400 }
        );
      }
    }

    const nivel = await prisma.nIVEL.upsert({
      where: {
        id: body.id ? parseInt(body.id, 10) : null || 0,
      },
      update: {
        nivel: body.nivel.toLowerCase(),
      },
      create: {
        nivel: body.nivel.toLowerCase(),
      },
    });

    /* // Verificar si existe el paralelo "A"
    let paralelo = await prisma.pARALELO.findUnique({
      where: {
        paralelo: "A",
      },
    });

    if (!paralelo) {
      paralelo = await prisma.pARALELO.create({
        data: {
          paralelo: "A",
        },
      });
    }

    await prisma.dETALLENIVELPARALELO.create({
      data: {
        NIVEL: {
          connect: {
            id: nivel.id,
          },
        },
        PARALELO: {
          connect: {
            id: paralelo.id,
          },
        },
      },
    }); */

    return NextResponse.json({
      message: "Nivel creado exitosamente",
      status: 200,
      nivel,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear el nivel" },
      { status: 500 }
    );
  }
}
