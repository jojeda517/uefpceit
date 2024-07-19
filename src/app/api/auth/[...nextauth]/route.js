import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Email", type: "text", placeholder: "jsmith" },
        contrasena: {
          label: "Password",
          type: "password",
          placeholder: "*****",
        },
      },
      async authorize(credentials, req) {
        const userFound = await prisma.USUARIO.findUnique({
          where: {
            correo: credentials.correo,
            contrasena: credentials.contrasena,
          },
        });

        //if (!userFound.length) throw new Error("User not found");
        if (!userFound) throw new Error("User not found");

        //const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

        //if (!matchPassword) throw new Error('Wrong password')
        return userFound;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
