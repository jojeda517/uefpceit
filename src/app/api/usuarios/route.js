import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  const usuarios = await prisma.usuario.findMany();
  return NextResponse.json(usuarios);
}

