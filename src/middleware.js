import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/docente/:path*", "/estudiante/:path*", "/administrador/:path*"],
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Redirige al login si no hay sesión activa
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const url = req.nextUrl.pathname;
  const userRoles = token.roles || [];

  // Restricciones de acceso según roles
  if (url.startsWith("/administrador") && !userRoles.includes("Administrador")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/docente") && !userRoles.includes("Docente")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/estudiante") && !userRoles.includes("Estudiante")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Si todo está bien, deja pasar
  return NextResponse.next();
}
