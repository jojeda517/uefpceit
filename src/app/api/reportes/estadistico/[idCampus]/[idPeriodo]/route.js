import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(_, { params }) {
  try {
    const { idCampus, idPeriodo } = params;

    if (!idCampus || !idPeriodo) {
      return NextResponse.json(
        { message: "Faltan parámetros obligatorios" },
        { status: 400 }
      );
    }

    const campusId = parseInt(idCampus);
    const periodoId = parseInt(idPeriodo);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    return NextResponse.json(
      { message: "Error al obtener datos del reporte" },
      { status: 500 }
    );
  }
}
