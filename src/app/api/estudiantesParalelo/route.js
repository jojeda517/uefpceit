import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid";

export async function GET(request, { params }) {
  //const { idPersona } = params;
  const datos = await prisma.eSTUDIANTE.findMany({
    where: {
      MATRICULA: {
        some: {
          idDocentePertenece: 1,
          idPeriodoPertenece: 1,
          DETALLEMATERIA: {
            idMateriaPertenece: 2,
            DETALLENIVELPARALELO: {
              idParaleloPertenece: 1,
              idNivelPertenece: 11,
              idCampusPertenece: 1,
              idEspecialidadPertenece: 4,
            },
          },
        },
      },
    },
    include: {
      PERSONA: true,
    },
  });

  return NextResponse.json(datos, { status: 200 });
}
