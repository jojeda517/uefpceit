import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import upload from "@/libs/multer";

export async function GET() {
  try {
    const especialidades = await prisma.eSPECIALIDAD.findMany({
      include: {
        DETALLECAMPUSESPECIALIDAD: {
          include: {
            CAMPUS: true,
          },
        },
        DETALLEESPECIALIDADNIVEL: {
          include: {
            NIVEL: true,
          },
        },
      },
    });

    // Contar los niveles por cada especialidad
    const especialidadesConNiveles = especialidades.map((especialidad) => {
      return {
        ...especialidad,
        cantidadNiveles: especialidad.DETALLEESPECIALIDADNIVEL.length,
      };
    });

    return NextResponse.json(especialidadesConNiveles);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las especialidades" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);

    // Validar entrada
    if (
      !body.especialidad ||
      !body.idNivel ||
      !body.idUltimoNivel ||
      !body.campus ||
      JSON.parse(body.campus).length === 0
    ) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // Crear especialidad
    const especialidad = await prisma.eSPECIALIDAD.upsert({
      where: { id: (body.id ? parseInt(body.id, 10) : null) || 0 },
      update: {
        especialidad: body.especialidad.toLowerCase(),
      },
      create: {
        especialidad: body.especialidad.toLowerCase(),
      },
    });

    console.log(especialidad);

    // Crear detalle campus especialidad
    await prisma.dETALLECAMPUSESPECIALIDAD.deleteMany({
      where: {
        idEspecialidadPertenece: especialidad.id,
      },
    });
    for (const campus of JSON.parse(body.campus)) {
      await prisma.dETALLECAMPUSESPECIALIDAD.create({
        data: {
          CAMPUS: {
            connect: {
              id: parseInt(campus.idCampus, 10)
            },
          },
          ESPECIALIDAD: {
            connect: {
              id: especialidad.id,
            },
          },
        },
      });
    }

    // Crear detalle especialidad nivel desde el nivel inicial hasta el último nivel
    await prisma.dETALLEESPECIALIDADNIVEL.deleteMany({
      where: {
        idEspecialidadPertenece: especialidad.id,
      },
    });

    for (
      let idNivel = parseInt(body.idNivel, 10);
      idNivel <= parseInt(body.idUltimoNivel, 10);
      idNivel++
    ) {
      await prisma.dETALLEESPECIALIDADNIVEL.create({
        data: {
          NIVEL: {
            connect: {
              id: idNivel,
            },
          },
          ESPECIALIDAD: {
            connect: {
              id: especialidad.id,
            },
          },
        },
      });
    }

    return NextResponse.json({
      message: "Especialidad guardada correctamente",
      data: especialidad,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al guardar la especialidad" },
      { status: 500 }
    );
  }
}
