import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const periodos = await prisma.pERIODO.findMany({
      include: {
        evaluacion: {
          include: {
            metodoEvaluacion: true,
          },
        },
        periodosModalidad: {
          include: {
            modalidad: true,
          },
        },
      },
    });
    return NextResponse.json(periodos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de los periodos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (
      !body.fechaInicio ||
      !body.fechaFin ||
      !body.idEvaluacionPertenece ||
      !body.descripcion
    ) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    const inicio = new Date(body.fechaInicio);
    const fin = new Date(body.fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return NextResponse.json(
        { message: "Formato de fecha inválido" },
        { status: 400 }
      );
    }

    let nombre = "";

    // Obtener evaluación
    let evaluacion;
    try {
      evaluacion = await prisma.eVALUACION.findUnique({
        where: { id: parseInt(body.idEvaluacionPertenece, 10) },
        include: {
          metodoEvaluacion: true,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Error al buscar la evaluación" },
        { status: 500 }
      );
    }

    if (!evaluacion) {
      return NextResponse.json(
        { message: "Evaluación no encontrada" },
        { status: 404 }
      );
    }

    // Generar nombre del periodo
    if (
      evaluacion.metodoEvaluacion.metodo.toLocaleLowerCase() === "ordinario"
    ) {
      nombre = `${inicio.getUTCFullYear()} - ${fin.getUTCFullYear()}`;
    } else if (
      evaluacion.metodoEvaluacion.metodo.toLocaleLowerCase() === "intensivo"
    ) {
      nombre = `${obtenerNombreMes(
        inicio.getUTCMonth()
      )} ${inicio.getUTCFullYear()} - ${obtenerNombreMes(
        fin.getUTCMonth()
      )} ${fin.getUTCFullYear()}`;
    } else {
      nombre = `${inicio.getUTCDay()} de ${obtenerNombreMes(
        inicio.getUTCMonth()
      )} de ${inicio.getUTCFullYear()} - ${fin.getUTCDay()} de ${obtenerNombreMes(
        fin.getUTCMonth()
      )} de ${fin.getUTCFullYear()}`;
    }

    let periodo;
    try {
      periodo = await prisma.pERIODO.upsert({
        where: { id: (body.id ? parseInt(body.id, 10) : null) || 0 },
        update: {
          idEvaluacionPertenece: evaluacion.id,
          nombre: nombre,
          fechaInicio: inicio,
          fechaFin: fin,
          descripcion: body.descripcion,
          estado: true,
        },
        create: {
          idEvaluacionPertenece: evaluacion.id,
          nombre: nombre,
          fechaInicio: inicio,
          fechaFin: fin,
          descripcion: body.descripcion,
          estado: true,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Error al guardar o actualizar el periodo" },
        { status: 500 }
      );
    }

    // Crear o actualizar periodos modalidad
    try {
      await prisma.dETALLEPERIODOMODALIDAD.deleteMany({
        where: {
          idPeriodoPertenece: periodo.id,
        },
      });

      if (body.modalidades) {
        for (const modalidad of JSON.parse(body.modalidades)) {
          await prisma.dETALLEPERIODOMODALIDAD.create({
            data: {
              periodo: {
                connect: { id: periodo.id },
              },
              modalidad: {
                connect: { id: parseInt(modalidad.idModalidad, 10) },
              },
            },
          });
        }
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Error al manejar las modalidades del periodo" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Periodo guardado exitosamente",
      data: periodo,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error inesperado al procesar la solicitud" },
      { status: 500 }
    );
  }
}

// Función para obtener el nombre del mes en español
function obtenerNombreMes(mes) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[mes];
}
