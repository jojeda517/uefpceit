import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  try {
    const { idEvaluacion } = params;

    const parciales = await prisma.pARCIAL.findMany({
      where: {
        idEvaluacionPertenece: parseInt(idEvaluacion),
      },
      include: {
        CIERREFASE: {
          select: {
            estado: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(parciales, { status: 200 });
  } catch (error) {
    console.error("Error fetching parciales:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
