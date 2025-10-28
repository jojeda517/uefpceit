import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

export async function GET() {
  const usuarios = await prisma.USUARIO.findMany();
  return NextResponse.json(usuarios);
}

