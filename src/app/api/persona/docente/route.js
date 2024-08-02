import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import bcrypt from "bcrypt";
import path from "path";
import { writeFile } from "fs/promises";

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

  // Upsert para PERSONA
  const persona = await prisma.pERSONA.upsert({
    where: { id: id || 0 }, // Utilizar 0 si id es null para la creación
    update: {
      id: id, // Este campo generalmente no debe ser actualizado
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      idCampusPertenece: parseInt(body.idCampusPertenece, 10),
      idParroquiaPertenece: parseInt(body.idParroquiaPertenece, 10),
      direccion: body.direccion,
      fechaNacimiento: new Date(body.fechaNacimiento),
      nacionalidad: body.nacionalidad,
      telefono: body.telefono,
      sexo: body.sexo,
      foto: fotoPath,
    },
    create: {
      id: id, // Este campo generalmente no debe ser creado
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      idCampusPertenece: parseInt(body.idCampusPertenece, 10),
      idParroquiaPertenece: parseInt(body.idParroquiaPertenece, 10),
      direccion: body.direccion,
      fechaNacimiento: new Date(body.fechaNacimiento),
      nacionalidad: body.nacionalidad,
      telefono: body.telefono,
      sexo: body.sexo,
      foto: fotoPath,
    },
  });

  // Upsert para DOCENTE
  const docente = await prisma.dOCENTE.upsert({
    where: { idPersonaPertenece: id || 0 },
    update: {
      PERSONA: {
        connect: { id: persona.id },
      },
      tiempoExperiencia: parseInt(body.tiempoExperiencia, 10),
    },
    create: {
      PERSONA: {
        connect: { id: persona.id },
      },
      tiempoExperiencia: parseInt(body.tiempoExperiencia, 10),
    },
  });

  // Upsert para USUARIO
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

  // Crear o actualizar detalles de rol
  if (body.roles) {
    await prisma.dETALLEROL.deleteMany({
      where: { idUsuarioPertenece: usuario.id },
    });

    for (const rol of JSON.parse(body.roles)) {
      await prisma.dETALLEROL.create({
        data: {
          USUARIO: {
            connect: { id: usuario.id },
          },
          ROL: {
            connect: { id: rol.id },
          },
        },
      });
    }
  }

  // Crear o actualizar detalles de docente título
  if (body.titulos) {
    await prisma.dETALLEDOCENTETITULO.deleteMany({
      where: { idDocentePertenece: docente.id },
    });

    for (const titulo of JSON.parse(body.titulos)) {
      await prisma.dETALLEDOCENTETITULO.create({
        data: {
          DOCENTE: {
            connect: { id: docente.id },
          },
          TITULO: {
            connect: { id: titulo.id },
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

    for (const experiencia of JSON.parse(body.experiencias)) {
      await prisma.dETALLEDOCENTEEXPERIENCIA.create({
        data: {
          DOCENTE: {
            connect: { id: docente.id },
          },
          EXPERIENCIA: {
            connect: { id: experiencia.id },
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
