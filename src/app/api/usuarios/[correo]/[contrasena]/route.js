import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// get para el login recibe el email y la contraseña
export async function GET(request, { params }) {
  console.log(params);
  const usuario = await prisma.usuario.findMany({
    where: {
      CON_USU: params.contrasena,
    },
  });

  const detalle = await prisma.detalle_rol.findMany({
    where: {
      ID_USU_PER: usuario[0].ID_USU,
    },
  });

  console.log(detalle[0]);

  const rol = await prisma.rol.findMany({
    where: {
      ID_ROL: detalle[0].ID_ROL_PER,
    },
  });

  usuario[0].rol = rol[0].ROL;

  return NextResponse.json(usuario[0]);
}
