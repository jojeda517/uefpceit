import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { v4 as uuidv4 } from "uuid"; // Importa la librería para generar UUIDs

export async function GET() {
  try {
    // Obtén las materias con la información relacionada de nivel y especialidad
    const materias = await prisma.mATERIA.findMany({
      include: {
        DETALLEMATERIA: {
          include: {
            DETALLENIVELPARALELO: {
              include: {
                NIVEL: true,
                CAMPUSESPECIALIDAD: {
                  include: {
                    ESPECIALIDAD: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Estructura los datos para agrupar por especialidad y nivel
    const resultado = [];

    materias.forEach((materia) => {
      materia.DETALLEMATERIA.forEach((detalle) => {
        const especialidad =
          detalle.DETALLENIVELPARALELO.CAMPUSESPECIALIDAD.ESPECIALIDAD
            .especialidad;
        const nivel = detalle.DETALLENIVELPARALELO.NIVEL.nivel;

        // Busca si ya existe un objeto con la misma especialidad y nivel
        let especialidadNivelObj = resultado.find(
          (item) => item.especialidad === especialidad && item.nivel === nivel
        );

        // Si no existe, añade un nuevo objeto
        if (!especialidadNivelObj) {
          especialidadNivelObj = {
            id: uuidv4(), // Genera un `id` único para cada fila
            especialidad: especialidad,
            nivel: nivel,
            materias: [],
          };
          resultado.push(especialidadNivelObj);
        }

        // Añadir la materia al arreglo de materias con id y nombre
        const materiaObj = {
          id: detalle.idMateriaPertenece, // Asumiendo que tienes un `id` para cada materia
          nombre: materia.nombre,
        };

        if (
          !especialidadNivelObj.materias.some((m) => m.id === materiaObj.id)
        ) {
          especialidadNivelObj.materias.push(materiaObj);
        }
      });
    });

    return NextResponse.json(resultado);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener datos de las materias" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.idEspecialidad || !body.idNivel || !body.nombre) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Buscar la materia si ya existe
    let materia = await prisma.mATERIA.findUnique({
      where: {
        nombre: body.nombre.toLowerCase(),
      },
    });

    // Si no existe, crea una nueva materia
    if (!materia) {
      materia = await prisma.mATERIA.create({
        data: {
          nombre: body.nombre,
        },
      });
    }

    // Buscar todos los paralelos de la especialidad y nivel
    const paralelos = await prisma.dETALLENIVELPARALELO.findMany({
      where: {
        idEspecialidadPertenece: parseInt(body.idEspecialidad, 10),
        idNivelPertenece: parseInt(body.idNivel, 10),
      },
    });

    // Crear un registro por cada paralelo siempre y cuando no exista ya la relación
    if (paralelos.length > 0) {
      await Promise.all(
        paralelos.map(async (paralelo) => {
          const detalleMateria = await prisma.dETALLEMATERIA.findFirst({
            where: {
              idMateriaPertenece: materia.id,
              idDetalleNivelParaleloPertenece: paralelo.id,
            },
          });

          if (!detalleMateria) {
            await prisma.dETALLEMATERIA.create({
              data: {
                idMateriaPertenece: materia.id,
                idDetalleNivelParaleloPertenece: paralelo.id,
              },
            });
          }
        })
      );
    } else {
      return NextResponse.json(
        { message: "No se encontraron paralelos para la especialidad y nivel" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Materia creada" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear una materia" },
      { status: 500 }
    );
  }
}
