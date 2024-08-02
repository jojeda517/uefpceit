import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcrypt";

export async function POST(request, { params }) {
  const body = await request.json();

  // Validar cédula
  if (!validarCedulaEcuatoriana(body.cedula)) {
    return NextResponse.json({ error: "Cédula inválida" }, { status: 400 });
  }

  // Verificar si la cedula ya existe sólo si es un nuevo usuario
  if (!body.id) {
    const cedulaExistente = await prisma.pERSONA.findUnique({
      where: { cedula: body.cedula },
    });
    if (cedulaExistente) {
      return NextResponse.json(
        { error: "La cédula ya está en uso" },
        { status: 400 }
      );
    }
  } else {
    // Verificar si la cedula ya está en uso por otro usuario
    const cedulaExistente = await prisma.pERSONA.findUnique({
      where: { cedula: body.cedula },
    });
    if (cedulaExistente && cedulaExistente.id != body.id) {
      // Si la cedula existe y no es el mismo usuario que se está actualizando
      return NextResponse.json(
        { error: "La cédula ya está en uso" },
        { status: 400 }
      );
    }
  }

  // Verificar si el correo ya existe sólo si es un nuevo usuario
  if (!body.id) {
    console.log("entro a verificar correo");
    const correoExistente = await prisma.uSUARIO.findUnique({
      where: { correo: body.correo },
    });
    if (correoExistente) {
      return NextResponse.json(
        { error: "El correo ya está en uso" },
        { status: 400 }
      );
    }
  } else {
    // Verificar si el correo ya está en uso por otro usuario
    const correoExistente = await prisma.uSUARIO.findUnique({
      where: { correo: body.correo },
    });
    if (correoExistente && correoExistente.idPersonaPertenece != body.id) {
      // Si el correo existe y no es el mismo usuario que se está actualizando
      return NextResponse.json(
        { error: "El correo ya está en uso" },
        { status: 400 }
      );
    }
  }

  // Encriptar contraseña si es nueva o se está actualizando
  let hashedPassword = body.contrasena;
  if (!body.id || body.contrasena) {
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(body.contrasena, saltRounds);
  }

  // Upsert para PERSONA
  const persona = await prisma.pERSONA.upsert({
    where: { id: body.id || 0 }, // Usar un valor que no existe para que se inserte si no se encuentra
    update: {
      idCampusPertenece: body.idCampusPertenece,
      idParroquiaPertenece: body.idParroquiaPertenece,
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      fechaNacimiento: body.fechaNacimiento,
      sexo: body.sexo,
      telefono: body.telefono,
      direccion: body.direccion,
      nacionalidad: body.nacionalidad,
      foto: body.foto,
    },
    create: {
      idCampusPertenece: body.idCampusPertenece,
      idParroquiaPertenece: body.idParroquiaPertenece,
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      fechaNacimiento: body.fechaNacimiento,
      sexo: body.sexo,
      telefono: body.telefono,
      direccion: body.direccion,
      nacionalidad: body.nacionalidad,
      foto: body.foto,
    },
  });

  // Upsert para DOCENTE
  const docente = await prisma.dOCENTE.upsert({
    where: { idPersonaPertenece: body.id || 0 }, // Usar un valor que no existe para que se inserte si no se encuentra
    update: {
      PERSONA: {
        connect: {
          id: persona.id,
        },
      },
      tiempoExperiencia: body.tiempoExperiencia,
    },
    create: {
      PERSONA: {
        connect: {
          id: persona.id,
        },
      },
      tiempoExperiencia: body.tiempoExperiencia,
    },
  });

  // Upsert para USUARIO
  const usuario = await prisma.uSUARIO.upsert({
    where: { idPersonaPertenece: body.id || 0 }, // Usar un valor que no existe para que se inserte si no se encuentra
    update: {
      correo: body.correo,
      contrasena: hashedPassword,
      PERSONA: {
        connect: {
          id: persona.id,
        },
      },
    },
    create: {
      correo: body.correo,
      contrasena: hashedPassword,
      PERSONA: {
        connect: {
          id: persona.id,
        },
      },
    },
  });

  // Crear o actualizar detalles de rol
  if (body.roles) {
    await prisma.dETALLEROL.deleteMany({
      where: { idUsuarioPertenece: usuario.id },
    });

    for (const rol of body.roles) {
      await prisma.dETALLEROL.create({
        data: {
          USUARIO: {
            connect: {
              id: usuario.id,
            },
          },
          ROL: {
            connect: {
              id: rol.id,
            },
          },
        },
      });
    }
  }

  // Crear o actualizar detalles de docente titulo
  if (body.titulos) {
    await prisma.dETALLEDOCENTETITULO.deleteMany({
      where: { idDocentePertenece: docente.id },
    });

    for (const titulo of body.titulos) {
      await prisma.dETALLEDOCENTETITULO.create({
        data: {
          DOCENTE: {
            connect: {
              id: docente.id,
            },
          },
          TITULO: {
            connect: {
              id: titulo.id,
            },
          },
        },
      });
    }
  }

  // Crear o actualizar detalles de docente experiencia
  if (body.experiencias) {
    await prisma.dETALLEDOCENTEEXPERIENCIA.deleteMany({
      where: { idDocentePertenece: docente.id },
    });

    for (const experiencia of body.experiencias) {
      await prisma.dETALLEDOCENTEEXPERIENCIA.create({
        data: {
          DOCENTE: {
            connect: {
              id: docente.id,
            },
          },
          EXPERIENCIA: {
            connect: {
              id: experiencia.id,
            },
          },
          cargo: experiencia.cargo,
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
