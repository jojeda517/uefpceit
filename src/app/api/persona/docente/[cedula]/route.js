import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';

// GET para obtener los datos de la persona
export async function GET(request, { params }) {
  try {
    // Buscar la persona e incluir la información del usuario
    const persona = await prisma.pERSONA.findUnique({
      where: {
        cedula: params.cedula,
      },
      include: {
        usuario: {
          include: {
            DETALLE_ROL: {
              include: {
                ROL: true, // Incluye la información del rol
              },
            },
          },
        },
        campus: true, // Incluye la información del campus
        parroquia: {
          include: {
            CANTON: {
              include: {
                PROVINCIA: true, // Incluye la información de la provincia
              },
            },
          },
        },
        docente: {
          include: {
            DETALLEDOCENTETITULO: {
              include: {
                TITULO: true, // Incluye la información del título
              },
            },
            DETALLEDOCENTEEXPERIENCIA: {
              include: {
                EXPERIENCIA: true, // Incluye la información de la experiencia
              },
            },
          },
        },
      },
    });

    if (!persona) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Obtener los roles del usuario
    const roles =
      persona.usuario?.DETALLE_ROL.map((detalleRol) => detalleRol.ROL) || [];

    // Añadir los roles al objeto de persona
    persona.usuario = {
      ...persona.usuario,
      roles,
    };

    // Añadir la experiencia y títulos del docente
    if (persona.docente) {
      persona.docente = {
        ...persona.docente,
        titulos:
          persona.docente.DETALLEDOCENTETITULO?.map(
            (detalleTitulo) => detalleTitulo.TITULO
          ) || null,
        experiencias:
          persona.docente.DETALLEDOCENTEEXPERIENCIA?.map(
            (detalleExperiencia) => ({
              cargo: detalleExperiencia.cargo,
              experiencia: detalleExperiencia.EXPERIENCIA,
            })
          ) || null,
      };
    }

    // Limpiar campos internos si es necesario
    delete persona.usuario?.DETALLE_ROL;
    delete persona.docente?.DETALLEDOCENTETITULO;
    delete persona.docente?.DETALLEDOCENTEEXPERIENCIA;

    return NextResponse.json(persona);
  } catch (error) {
    return NextResponse.error({
      status: 500,
      statusText: "Internal Server Error",
      body: {
        error: "Error al obtener la persona",
      },
    });
  }
}
