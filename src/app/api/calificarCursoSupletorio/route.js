import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function POST(request) {
  try {
    const { supletorios } = await request.json(); // Datos enviados desde el frontend

    // Usar transacciones para garantizar consistencia
    const promises = supletorios.map(
      async ({ idMatricula, notaSupletorio, estado }) => {
        // Si tiene nota de supletorio, insertar o actualizar en la tabla SUPLETORIO
        if (notaSupletorio !== null) {
          await prisma.SUPLETORIO.upsert({
            where: { idMatricula },
            update: { nota: notaSupletorio, fecha: new Date() },
            create: { idMatricula, nota: notaSupletorio, fecha: new Date() },
          });
        }

        // Actualizar el estado en la tabla MATRICULA
        await prisma.MATRICULA.update({
          where: { id: idMatricula },
          data: { estado },
        });
      }
    );

    // Ejecutar todas las promesas
    await Promise.all(promises);

    return NextResponse.json({
      message: "Supletorios y estados actualizados correctamente.",
      success: true,
    });
  } catch (e) {
    console.error("Error al procesar los datos:", e);
    return NextResponse.json(
      {
        message: "Hubo un error al procesar los datos.",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
