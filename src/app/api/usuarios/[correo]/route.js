import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

// get para el login recibe el email
export async function GET(request, { params }) {
  console.log(params);
  const usuario = await prisma.usuario.findMany({
    where: {
      COR_USU: params.correo,
    },
  });
  return NextResponse.json(usuario[0]);
}
