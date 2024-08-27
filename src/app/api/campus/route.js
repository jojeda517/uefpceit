import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const campus = await prisma.cAMPUS.findMany();
    return NextResponse.json(campus);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos del campusa" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.nombre || !body.direccion) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // Validar que no exista un campus con el mismo nombre si se envia el id
    if (!body.id) {
      const campusExistente = await prisma.cAMPUS.findFirst({
        where: {
          nombre: body.nombre,
        },
      });

      if (campusExistente) {
        return NextResponse.json(
          { message: "Ya existe un campus con el mismo nombre" },
          { status: 400 }
        );
      }
    } else {
      const campusExistente = await prisma.cAMPUS.findFirst({
        where: {
          nombre: body.nombre,
          id: {
            not: parseInt(body.id, 10),
          },
        },
      });

      if (campusExistente) {
        return NextResponse.json(
          { message: "Ya existe un campus con el mismo nombre" },
          { status: 400 }
        );
      }
    }

    const campus = await prisma.cAMPUS.upsert({
      where: { id: (body.id ? parseInt(body.id, 10) : null) || 0 },
      update: {
        nombre: body.nombre,
        direccion: body.direccion,
      },
      create: {
        nombre: body.nombre,
        direccion: body.direccion,
      },
    });

    return NextResponse.json({
      message: "Campus creado correctamente",
      status: 200,
      data: campus,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear campus" },
      { status: 500 }
    );
  }
}
