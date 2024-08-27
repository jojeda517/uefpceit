import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

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
