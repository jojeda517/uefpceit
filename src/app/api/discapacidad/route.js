import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

export async function GET() {
  try {
    const discapacidades = await prisma.dISCAPACIDAD.findMany({
      include: {
        DETALLE_DISCAPACIDAD: true,
      },
    });
    return NextResponse.json(discapacidades);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las discapacidades" },
      { status: 500 }
    );
  }
}