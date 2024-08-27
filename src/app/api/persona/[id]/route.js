import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

// GET para obtener los datos de la persona
export async function GET(request, { params }) {
  const persona = await prisma.pERSONA.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });
  return NextResponse.json(persona);
}
