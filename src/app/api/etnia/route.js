import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

export async function GET() {
  try {
    const etnias = await prisma.eTNIA.findMany();
    return NextResponse.json(etnias);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las etnias" },
      { status: 500 }
    );
  }
}
