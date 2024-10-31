import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(request, { params }) {
  console.log(params.nivel, params.especialidad, params.campus);

  // Obtener los paralelos y contar los estudiantes únicos en cada paralelo
  const paralelos = await prisma.dETALLENIVELPARALELO.findMany({
    where: {
      idNivelPertenece: parseInt(params.nivel),
      idEspecialidadPertenece: parseInt(params.especialidad),
      idCampusPertenece: parseInt(params.campus),
    },
    select: {
      PARALELO: true,
      DETALLEMATERIA: {
        select: {
          MATRICULA: {
            select: {
              idEstudiantePertenece: true,  // Asumiendo que estudianteId está en MATRICULA
            },
            distinct: ['idEstudiantePertenece'],  // Evita contar estudiantes repetidos en varias materias
          },
        },
      },
    },
  });

  // Ahora sumamos los conteos de estudiantes únicos en cada paralelo
  const resultado = paralelos.map((paralelo) => {
    // Obtener todos los estudiantes sin duplicados
    const estudiantesUnicos = new Set();

    paralelo.DETALLEMATERIA.forEach((materia) => {
      materia.MATRICULA.forEach((matricula) => {
        estudiantesUnicos.add(matricula.estudianteId);  // Añadir estudianteId al Set
      });
    });

    return {
      PARALELO: paralelo.PARALELO,
      TOTAL: estudiantesUnicos.size,  // Contar los estudiantes únicos
    };
  });

  return NextResponse.json(resultado);
}
