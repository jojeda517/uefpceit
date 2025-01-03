import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { jsPDF } from "jspdf"; // Asegúrate de haber instalado jsPDF
import { select } from "@nextui-org/react";

export async function GET() {
  const result = await prisma.eSTUDIANTE.findMany({
    where: {
      MATRICULA: {
        some: {
          PERIODO: {
            estado: true, // Filtrar por periodo activo
          },
        },
      },
    },
    select: {
      PERSONA: {
        select: {
          nombre: true,
          apellido: true,
          foto: true,
          usuario: {
            select: {
              correo: true,
            },
          },
        },
      },
      MATRICULA: {
        select: {
          PERIODO: {
            select: {
              nombre: true, // Nombre del periodo
            },
          },
          DETALLEMATERIA: {
            select: {
              DETALLENIVELPARALELO: {
                select: {
                  NIVEL: {
                    select: {
                      nivel: true,
                    },
                  },
                  PARALELO: {
                    select: {
                      paralelo: true,
                    },
                  },
                  CAMPUSESPECIALIDAD: {
                    select: {
                      ESPECIALIDAD: {
                        select: {
                          especialidad: true,
                        },
                      },
                      CAMPUS: {
                        // Seleccionar el campus
                        select: {
                          nombre: true, // Nombre del campus
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Filtrar manualmente para obtener solo una matrícula única por estudiante
  const filteredResult = result.map((estudiante) => {
    const primeraMatricula = estudiante.MATRICULA[0]; // Tomamos solo la primera matrícula

    return {
      PERSONA: estudiante.PERSONA,
      MATRICULA: primeraMatricula
        ? {
            NIVEL:
              primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.NIVEL.nivel,
            PARALELO:
              primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO.PARALELO
                .paralelo,
            ESPECIALIDAD:
              primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO
                .CAMPUSESPECIALIDAD.ESPECIALIDAD.especialidad,
            CAMPUS:
              primeraMatricula.DETALLEMATERIA.DETALLENIVELPARALELO
                .CAMPUSESPECIALIDAD.CAMPUS.nombre, // Nombre del campus
            PERIODO: primeraMatricula.PERIODO.nombre, // Nombre del periodo
          }
        : null,
    };
  });

  return NextResponse.json(filteredResult);
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (
      !body.idCampusPertenece ||
      !body.idEspecialidadPertenece ||
      !body.idNivelPertenece ||
      !body.idParaleloPertenece ||
      !body.idEstudiantePertenece ||
      !body.idPeriodoPertenece
    ) {
      return NextResponse.json(
        { message: "Datos de entrada incompletos" },
        { status: 400 }
      );
    }

    // 1. Obtener el detalle del nivel-paralelo-especialidad
    const detalleNivelParalelo = await prisma.dETALLENIVELPARALELO.findFirst({
      where: {
        idCampusPertenece: parseInt(body.idCampusPertenece),
        idEspecialidadPertenece: parseInt(body.idEspecialidadPertenece),
        idNivelPertenece: parseInt(body.idNivelPertenece),
        idParaleloPertenece: parseInt(body.idParaleloPertenece),
      },
      include: {
        CAMPUSESPECIALIDAD: {
          select: {
            CAMPUS: true,
          },
        },
      },
    });

    console.log(detalleNivelParalelo);

    if (!detalleNivelParalelo) {
      return res.status(404).json({
        message:
          "No se encontró el detalle del nivel-paralelo para la especialidad y campus proporcionados.",
      });
    }

    // 2. Obtener todas las materias asociadas al detalleNivelParalelo
    const materias = await prisma.dETALLEMATERIA.findMany({
      where: {
        idDetalleNivelParaleloPertenece: detalleNivelParalelo.id,
      },
    });
    console.log(materias);

    if (materias.length === 0) {
      return res.status(404).json({
        message:
          "No se encontraron materias para el nivel, paralelo y especialidad seleccionados.",
      });
    }

    // 3. Si el estudiante ya está matriculado en el periodo, eliminar la matrícula
    /* await prisma.mATRICULA.deleteMany({
      where: {
        idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
        idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
      },
    }); */
    await prisma.$transaction(async (prisma) => {
      // Eliminar aportes relacionados
      await prisma.APORTE.deleteMany({
        where: {
          CALIFICACION: {
            MATRICULA: {
              idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
              idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            },
          },
        },
      });

      // Wliminar examenes relacionados
      await prisma.EXAMEN.deleteMany({
        where: {
          CALIFICACION: {
            MATRICULA: {
              idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
              idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            },
          },
        },
      });

      // Eliminar asistencia relacionada
      await prisma.ASISTENCIA.deleteMany({
        where: {
          CALIFICACION: {
            MATRICULA: {
              idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
              idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            },
          },
        },
      });

      // Eliminar conducta relacionada
      await prisma.CONDUCTA.deleteMany({
        where: {
          CALIFICACION: {
            MATRICULA: {
              idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
              idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            },
          },
        },
      });

      // Eliminar calificaciones relacionadas
      await prisma.CALIFICACION.deleteMany({
        where: {
          MATRICULA: {
            idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
            idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
          },
        },
      });

      // Eliminar supletorios relacionados
      await prisma.SUPLETORIO.deleteMany({
        where: {
          MATRICULA: {
            idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
            idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
          },
        },
      });

      // Finalmente, eliminar la matrícula
      await prisma.mATRICULA.deleteMany({
        where: {
          idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
          idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
        },
      });
    });

    // 4. Crear las matrículas para cada materia, asignando el docente correspondiente
    const matriculas = await Promise.all(
      materias.map(async (materia) => {
        // Buscar si ya existe una matrícula con un docente asignado para esta materia y nivel
        const matriculaExistente = await prisma.mATRICULA.findFirst({
          where: {
            idDetalleMateriaPertenece: materia.id,
            idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            idDocentePertenece: {
              not: null, // Asegurarse de que haya un docente asignado
            },
          },
        });

        let idDocenteAsignado = matriculaExistente
          ? matriculaExistente.idDocentePertenece
          : null;

        return await prisma.mATRICULA.create({
          data: {
            idDetalleMateriaPertenece: parseInt(materia.id),
            idPeriodoPertenece: parseInt(body.idPeriodoPertenece),
            idEstudiantePertenece: parseInt(body.idEstudiantePertenece),
            idDocentePertenece: idDocenteAsignado, // Asignar el docente obtenido
            estado: null, // Estado de la matrícula, puedes ajustarlo según sea necesario
          },
        });
      })
    );

    // 5. Generar PDF para el estudiante
    const periodo = await prisma.pERIODO.findUnique({
      where: {
        id: parseInt(body.idPeriodoPertenece),
      },
    });

    const estudiante = await prisma.eSTUDIANTE.findUnique({
      where: {
        id: parseInt(body.idEstudiantePertenece),
      },
      include: {
        PERSONA: {
          include: {
            parroquia: {
              include: {
                CANTON: true,
              },
            },
          },
        },
        ESTADO_CIVIL: true,
      },
    });

    const hoy = new Date();
    const fechaNacimiento = new Date(estudiante.PERSONA.fechaNacimiento);

    // Calcular la edad en años
    let edad = hoy.getUTCFullYear() - fechaNacimiento.getUTCFullYear();

    // Ajustar si aún no ha pasado su cumpleaños este año
    if (
      hoy.getUTCMonth() < fechaNacimiento.getUTCMonth() ||
      (hoy.getUTCMonth() === fechaNacimiento.getUTCMonth() &&
        hoy.getUTCDate() < fechaNacimiento.getUTCDate())
    ) {
      edad--;
    }

    // Calcular los meses
    let meses = hoy.getUTCMonth() - fechaNacimiento.getUTCMonth();
    if (meses < 0) {
      meses += 12;
    }

    // Calcular los días
    let dias = hoy.getUTCDate() - fechaNacimiento.getUTCDate();
    if (dias < 0) {
      // Obtener el último día del mes anterior
      const ultimoDiaMesAnterior = new Date(
        hoy.getUTCFullYear(),
        hoy.getUTCMonth(),
        0
      ).getUTCDate();
      dias += ultimoDiaMesAnterior;
    }

    const nivel = await prisma.nIVEL.findUnique({
      where: {
        id: parseInt(body.idNivelPertenece),
      },
    });

    const especialidad = await prisma.eSPECIALIDAD.findUnique({
      where: {
        id: parseInt(body.idEspecialidadPertenece),
      },
    });

    const paralelo = await prisma.pARALELO.findUnique({
      where: {
        id: parseInt(body.idParaleloPertenece),
      },
    });

    const pdfBytes = await generatePDF(
      periodo.nombre,
      estudiante.PERSONA.nombre + " " + estudiante.PERSONA.apellido,
      edad,
      meses,
      dias,
      estudiante.PERSONA.nacionalidad,
      estudiante.lugarNacimiento,
      fechaNacimiento.getUTCDate() +
        "/" +
        (fechaNacimiento.getUTCMonth() + 1) +
        "/" +
        fechaNacimiento.getUTCFullYear(),
      estudiante.ESTADO_CIVIL.estadoCivil,
      estudiante.PERSONA.parroquia.CANTON.canton,
      estudiante.PERSONA.telefono,
      nivel.nivel,
      especialidad.especialidad,
      paralelo.paralelo
    );

    // Establecer el encabezado para la descarga
    const fileName = `matricula_estudiante_${body.idEstudiantePertenece}.pdf`;
    const response = new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener datos de los paralelos" },
      { status: 500 }
    );
  }
}

// Función para generar un PDF con la matrícula del estudiante utilizando jsPDF
async function generatePDF(
  periodo,
  estudiante,
  años,
  meses,
  dias,
  nacionalidad,
  lugarNacimiento,
  fechaNacimiento,
  estadoCivil,
  canton,
  telefono,
  nivel,
  especialidad,
  paralelo
) {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    // Configuración del documento
    doc.setPage("a4");
    doc.setFont("helvetica", "normal");

    // Título principal
    const encabezado = "UNIDAD EDUCATIVA PCEI TUNGURAHUA";
    doc.setFontSize(12);
    doc.text(encabezado, 105, 15, { align: "center" }); // Centrar el encabezado

    // Tamaño de fuente para el cuerpo del documento
    doc.setFontSize(11);

    // Posición inicial para el contenido
    let y = 30; // Posición vertical inicial
    const lineHeight = 7; // Espacio entre líneas

    // Información básica de la matrícula
    doc.text(`Periodo lectivo: ${periodo}`, 10, y);
    y += lineHeight;

    const fechaActual = new Date();
    doc.text(
      `En Ambato a: ${fechaActual.getDate()}/${
        fechaActual.getMonth() + 1
      }/${fechaActual.getFullYear()}`,
      10,
      y
    );
    y += lineHeight;

    doc.text(
      `Ante el suscrito secretario de la Unidad Educativa PCEI Tungurahua, se presentó el señor(a):`,
      10,
      y
    );
    y += lineHeight;

    // Poner el nombre del estudiante en negrita
    doc.setFont("helvetica", "bold"); // Cambiar a negrita
    doc.text(`${estudiante.toUpperCase()}:`, 10, y);
    doc.setFont("helvetica", "normal"); // Volver al estilo normal
    y += lineHeight;

    // Descripción detallada del estudiante
    let parrafo1 = `De ${años} años, ${meses} meses y ${dias} días de edad, de nacionalidad `;

    // Negrita para la nacionalidad
    doc.setFont("helvetica", "bold");
    parrafo1 += `${nacionalidad.toUpperCase()}`;

    doc.setFont("helvetica", "normal");
    parrafo1 += `, nacido(a) en `;

    // Negrita para lugar de nacimiento
    doc.setFont("helvetica", "bold");
    parrafo1 += `${lugarNacimiento.toUpperCase()}`;

    doc.setFont("helvetica", "normal");
    parrafo1 += ` el ${fechaNacimiento}. Estado civil: `;

    // Negrita para el estado civil
    doc.setFont("helvetica", "bold");
    parrafo1 += `${estadoCivil}`;

    doc.setFont("helvetica", "normal");
    parrafo1 += `, de profesión: ESTUDIANTE. Domicilio: `;

    // Negrita para el domicilio
    doc.setFont("helvetica", "bold");
    parrafo1 += `${canton}`;

    doc.setFont("helvetica", "normal");
    parrafo1 += `, teléfono: ${telefono}. Solicita su matrícula en el nivel `;

    // Negrita para el nivel, especialidad y paralelo
    doc.setFont("helvetica", "bold");
    parrafo1 += `${nivel.toUpperCase()} de la especialidad ${especialidad.toUpperCase()}, paralelo "${paralelo.toUpperCase()}".`;

    const parrafo1Lineas = doc.splitTextToSize(parrafo1, 180);
    parrafo1Lineas.forEach((line, index) => {
      doc.text(line, 10, y + index * lineHeight);
    });
    y += lineHeight * parrafo1Lineas.length;

    const parrafo2 = doc.splitTextToSize(
      `El/La estudiante manifiesta que acepta lo constante en la presente acta y se compromete a respetar los mandatos legales, colaborando con la Unidad Educativa Fiscomisional PCEI Tungurahua para el éxito en sus estudios. Suscribe esta acta junto con el/la secretario(a), quien certifica.`,
      180
    );
    parrafo2.forEach((line, index) => {
      doc.text(line, 10, y + index * lineHeight);
    });
    y += lineHeight * parrafo2.length;

    // Espacio para firmas
    y += 15; // Añadir espacio antes de las firmas

    // Línea para la firma del Rector
    doc.setLineWidth(0.5);
    doc.line(10, y, 60, y); // Coordenadas x1, y1, x2, y2
    doc.text("Rector", 35, y + 10, { align: "center" }); // Texto centrado en la línea

    // Línea para la firma del Secretario
    doc.line(80, y, 130, y);
    doc.text("Secretario", 105, y + 10, { align: "center" }); // Texto centrado en la línea

    // Línea para la firma del Estudiante
    doc.line(150, y, 200, y);
    doc.text("Estudiante", 175, y + 10, { align: "center" }); // Texto centrado en la línea

    // Guardar el PDF en memoria como arraybuffer
    const pdfBytes = doc.output("arraybuffer");
    resolve(pdfBytes);
  });
}
