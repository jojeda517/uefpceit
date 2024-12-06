import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/docente/:path*", "/estudiante/:path*", "/administrador/:path*"],
};
export async function middleware(req) {
  //return NextResponse.next();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token en middleware:", token);

  // Si no hay token, redirigir a la página de inicio de sesión
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const roles = token.roles || []; // Roles del usuario desde el token
  const pathname = req.nextUrl.pathname; // Ruta que intenta acceder

  // Definir las rutas permitidas por rol
  const roleRoutes = {
    administrador: /^\/administrador(\/|$)/,
    docente: /^\/docente(\/|$)/,
    estudiante: /^\/estudiante(\/|$)/,
  };

  // Verificar si el usuario tiene acceso a la ruta actual
  const hasAccess = roles.some((role) => {
    const regex = roleRoutes[role.toLowerCase()];
    return regex && regex.test(pathname);
  });

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

/* export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token en middleware:", process.env.NEXTAUTH_SECRET);
  console.log("Token en middleware:", token);
  console.log("Token en middleware:", req);

  if (!token) {
    // Redirige al login si no hay sesión activa
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const url = req.nextUrl.pathname;
  const userRoles = token.roles || [];

  // Restricciones de acceso según roles
  if (
    url.startsWith("/administrador") &&
    !userRoles.includes("Administrador")
  ) {
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
 */
