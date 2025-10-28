import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

// get para el login recibe el email y la contraseña
export async function GET(request, { params }) {
  console.log(params);
  const usuario = await prisma.usuario.findMany({
    where: {
      contrasena: params.contrasena,
    },
  });

  const detalle = await prisma.detalle_rol.findMany({
    where: {
      idUsuarioPertenece: usuario[0].id,
    },
  });

  console.log(detalle[0]);

  const rol = await prisma.rol.findMany({
    where: {
      id: detalle[0].idRolPertenece,
    },
  });

  usuario[0].rol = rol[0].ROL;

  return NextResponse.json(usuario[0]);
}
