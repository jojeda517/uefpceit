import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/db";
import bcrypt from "bcrypt";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        /* const userFound = await db.user.findUnique({
            where: {
                email: credentials.email
            }
        }) */
        const userFound = await prisma.usuario.findMany({
          where: {
            COR_USU: credentials.email,
            CON_USU: credentials.password,
          },
        });

        if (!userFound.length) throw new Error("User not found");
        
        //const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

        //if (!matchPassword) throw new Error('Wrong password')

        console.log(userFound[0]);

        return {
          /* id: userFound.id,
            name: userFound.username, */
          email: userFound[0].COR_USU,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
