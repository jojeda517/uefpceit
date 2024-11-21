import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const body = await request.json();

    // Buscar la persona con su usuario asociado
    const persona = await prisma.pERSONA.findUnique({
      where: {
        id: parseInt(body.idPersona),
      },
      include: {
        usuario: true,
      },
    });

    if (!persona) {
      return NextResponse.json(
        { message: "La persona no existe." },
        { status: 404 }
      );
    }

    // Verificar si el correo ya existe y no corresponde al usuario actual
    const usuario = await prisma.uSUARIO.findUnique({
      where: {
        correo: body.correo,
        NOT: {
          id: persona.usuario.id,
        },
      },
    });

    if (usuario) {
      return NextResponse.json(
        { message: "El correo ya está en uso." },
        { status: 400 }
      );
    }

    // Iniciar una transacción para garantizar consistencia
    await prisma.$transaction(async (tx) => {
      // Actualizar el usuario
      await tx.uSUARIO.update({
        where: {
          id: persona.usuario.id,
        },
        data: {
          correo: body.correo,
          contrasena: await bcrypt.hash(body.password, 10),
        },
      });

      // Actualizar la persona
      await tx.pERSONA.update({
        where: {
          id: parseInt(body.idPersona),
        },
        data: {
          telefono: body.celular,
        },
      });
    });

    return NextResponse.json({
      message: "Los datos se actualizaron correctamente.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al actualizar los datos." },
      { status: 500 }
    );
  }
}
