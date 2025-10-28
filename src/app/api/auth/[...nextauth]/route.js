import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        contrasena: {
          label: "Password",
          type: "password",
          placeholder: "*****",
        },
      },
      async authorize(credentials, req) {
        const user = await prisma.USUARIO.findUnique({
          where: {
            correo: credentials.correo,
          },
          include: {
            DETALLE_ROL: {
              include: {
                ROL: true,
              },
            },
            PERSONA: {
              select: {
                telefono: true,
                foto: true,
                nombre: true,
                apellido: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Verificar la contraseña
        /* if (credentials.contrasena !== user.contrasena) {
          throw new Error("Incorrect password");
        } */
        const isMatch = await bcrypt.compare(
          credentials.contrasena,
          user.contrasena
        );
        //console.log(user);
        if (!isMatch) {
          throw new Error("Incorrect password");
        }

        // Construir el objeto de sesión
        return {
          id: user.id,
          correo: user.correo,
          telefono: user.PERSONA.telefono,
          foto: user.PERSONA.foto,
          nombre: user.PERSONA.nombre,
          apellido: user.PERSONA.apellido,
          roles: user.DETALLE_ROL.map((detail) => detail.ROL.rol), // Obtener los roles del usuario
          idPersonaPertenece: user.idPersonaPertenece,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Añadir roles a la sesión
      if (token) {
        session.user.correo = token.correo;
        session.user.roles = token.roles;
        session.user.idPersonaPertenece = token.idPersonaPertenece;
        session.user.telefono = token.telefono;
        session.user.foto = token.foto;
        session.user.nombre = token.nombre;
        session.user.apellido = token.apellido;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Añadir roles al token
      if (user) {
        token.correo = user.correo;
        token.roles = user.roles;
        token.telefono = user.telefono;
        token.idPersonaPertenece = user.idPersonaPertenece;
        token.foto = user.foto;
        token.nombre = user.nombre;
        token.apellido = user.apellido;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
