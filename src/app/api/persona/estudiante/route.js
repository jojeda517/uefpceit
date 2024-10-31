import { NextResponse } from "next/server";
import prisma from '@/libs/prisma';
import bcrypt from "bcrypt";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET() {
  const estudiantes = await prisma.eSTUDIANTE.findMany({
    where: {
      PERSONA: {
        estado: true,
      },
    },
    include: {
      PERSONA: true,
    }
  });

  return NextResponse.json(estudiantes);
}

export async function POST(request) {
  const data = await request.formData();

  // Extraer datos del formulario
  const body = Object.fromEntries(data.entries());
  const foto = data.get("foto"); // Asegúrate de que el nombre del campo coincida

  // Validar cédula
  if (!validarCedulaEcuatoriana(body.cedula)) {
    return NextResponse.json({ error: "Cédula inválida" }, { status: 400 });
  }

  // Convertir id a entero si existe
  const id = body.id ? parseInt(body.id, 10) : null;

  // Verificar existencia de cédula
  const cedulaExistente = await prisma.pERSONA.findUnique({
    where: { cedula: body.cedula },
  });
  if (cedulaExistente && cedulaExistente.id !== id) {
    return NextResponse.json(
      { error: "La cédula ya está en uso" },
      { status: 400 }
    );
  }

  // Verificar existencia de correo
  const correoExistente = await prisma.uSUARIO.findUnique({
    where: { correo: body.correo },
  });
  if (correoExistente && correoExistente.idPersonaPertenece !== id) {
    return NextResponse.json(
      { error: "El correo ya está en uso" },
      { status: 400 }
    );
  }

  // Encriptar contraseña
  let hashedPassword = body.contrasena;
  if (!id || body.contrasena) {
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(body.contrasena, saltRounds);
  }

  // Manejo de la foto
  let fotoPath = body.foto || ""; // Usar el valor del formulario si está presente
  if (foto) {
    const bytes = await foto.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${body.cedula}.png`;
    const filePath = path.join(process.cwd(), "public/img/photo", fileName);
    await writeFile(filePath, buffer);

    fotoPath = `/img/photo/${fileName}`;
  }

  // Crear o actualizar persona
  const persona = await prisma.pERSONA.upsert({
    where: { id: id || 0 },
    update: {
      campus: {
        connect: {
          id: parseInt(body.idCampusPertenece, 10),
        },
      },
      parroquia: {
        connect: {
          id: parseInt(body.idParroquiaPertenece, 10),
        },
      },
      nombre: body.nombre,
      apellido: body.apellido,
      cedula: body.cedula,
      estado: true,
      direccion: body.direccion,
      fechaNacimiento: new Date(body.fechaNacimiento),
      nacionalidad: body.nacionalidad,
      telefono: body.telefono,
      sexo: body.sexo,
      foto: fotoPath,
    },
    create: {
      campus: {
        connect: {
          id: parseInt(body.idCampusPertenece, 10),
        },
      },
      parroquia: {
        connect: {
          id: parseInt(body.idParroquiaPertenece, 10),
        },
      },
      nombre: body.nombre,
      apellido: body.apellido,
      cedula: body.cedula,
      estado: true,
      direccion: body.direccion,
      fechaNacimiento: new Date(body.fechaNacimiento),
      nacionalidad: body.nacionalidad,
      telefono: body.telefono,
      sexo: body.sexo,
      foto: fotoPath,
    },
  });

  // Buscar si el representante ya existe en la base de datos
  const representanteFind = await prisma.rEPRESENTANTE.findUnique({
    where: { cedula: body.cedulaRepresentante || 0 },
  });
  // Crear o acrualizar Representante
  let representante;
  if (!representanteFind) {
    // Si no existe el representante
    representante = await prisma.rEPRESENTANTE.create({
      data: {
        cedula: body.cedulaRepresentante,
        nombre: body.nombresRepresentante,
        apellido: body.apellidosRepresentante,
        direccion: body.direccionRepresentante,
        telefono: body.telefonoRepresentante,
        ocupacion: body.ocupacionRepresentante,
      },
    });
  } else {
    // Si existe el representante
    representante = await prisma.rEPRESENTANTE.update({
      where: { cedula: body.cedulaRepresentante },
      data: {
        nombre: body.nombresRepresentante,
        apellido: body.apellidosRepresentante,
        direccion: body.direccionRepresentante,
        telefono: body.telefonoRepresentante,
        ocupacion: body.ocupacionRepresentante,
      },
    });
  }

  // Crear o actualizar Estudiante
  console.log(body.numeroCarnetDiscapacidad === "null" ? null : body.numeroCarnetDiscapacidad);
  const estudiante = await prisma.eSTUDIANTE.upsert({
    where: { idPersonaPertenece: id || 0 },
    update: {
      PERSONA: {
        connect: { id: persona.id },
      },
      ESTADO_CIVIL: {
        connect: {
          id: parseInt(body.idEstadoCivilPertenece, 10),
        },
      },
      ETNIA: {
        connect: {
          id: parseInt(body.idEtniaPertenece, 10),
        },
      },
      REPRESENTANTE: {
        connect: {
          id: representante.id,
        },
      },
      trabaja: body.trabaja === "true",
      nombreTrabajo: body.nombreTrabajo,
      tieneHijo: body.tieneHijo === "true",
      rangoEdadHijo: body.rangoEdadHijo,
      bonoMies: body.bonoMies === "true",
      numeroCarnetDiscapacidad: body.numeroCarnetDiscapacidad === "null" ? null : body.numeroCarnetDiscapacidad,
      lugarNacimiento: body.lugarNacimiento,
      codigoElectricoUnico: body.codigoElectricoUnico,
      observacion: body.observacion,
    },
    create: {
      PERSONA: {
        connect: { id: persona.id },
      },
      ESTADO_CIVIL: {
        connect: {
          id: parseInt(body.idEstadoCivilPertenece, 10),
        },
      },
      ETNIA: {
        connect: {
          id: parseInt(body.idEtniaPertenece, 10),
        },
      },
      REPRESENTANTE: {
        connect: {
          id: representante.id,
        },
      },
      trabaja: body.trabaja === "true",
      nombreTrabajo: body.nombreTrabajo,
      tieneHijo: body.tieneHijo === "true",
      rangoEdadHijo: body.rangoEdadHijo,
      bonoMies: body.bonoMies === "true",
      numeroCarnetDiscapacidad: body.numeroCarnetDiscapacidad === "null" ? null : body.numeroCarnetDiscapacidad,
      lugarNacimiento: body.lugarNacimiento,
      codigoElectricoUnico: body.codigoElectricoUnico,
      observacion: body.observacion,
    },
  });

  // Crear o actualizar Usuario
  const usuario = await prisma.uSUARIO.upsert({
    where: { idPersonaPertenece: id || 0 },
    update: {
      correo: body.correo,
      contrasena: hashedPassword,
      PERSONA: {
        connect: { id: persona.id },
      },
    },
    create: {
      correo: body.correo,
      contrasena: hashedPassword,
      PERSONA: {
        connect: { id: persona.id },
      },
    },
  });

  // Crear o actualizar detalles del rol
  await prisma.dETALLEROL.deleteMany({
    where: { idUsuarioPertenece: usuario.id },
  });
  await prisma.dETALLEROL.create({
    data: {
      ROL: {
        connect: { rol: "Estudiante" },
      },
      USUARIO: {
        connect: {
          id: usuario.id,
        },
      },
    },
  });

  // Crear o actualizar detalles de discapacidad
  await prisma.dETALLEDISCAPACIDAD.deleteMany({
    where: { idEstudiantePertenece: estudiante.id },
  });
  if (body.discapacidades) {
    for (const discapacidad of JSON.parse(body.discapacidades)) {
      await prisma.dETALLEDISCAPACIDAD.create({
        data: {
          ESTUDIANTE: {
            connect: { id: estudiante.id },
          },
          Discapacidad: {
            connect: { id: discapacidad.Discapacidad.id },
          },
          porcentaje: discapacidad.porcentaje,
        },
      });
    }
  }

  // Retornar la respuesta
  return NextResponse.json(persona, { status: 201 });
}

function validarCedulaEcuatoriana(cedula) {
  if (cedula.length !== 10) return false;

  const digitos = cedula.split("").map(Number);
  const digitoVerificador = digitos.pop();
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];

  const suma = digitos.reduce((acc, digit, index) => {
    let producto = digit * coeficientes[index];
    if (producto >= 10) producto -= 9;
    return acc + producto;
  }, 0);

  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

  return digitoCalculado === digitoVerificador;
}
