export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/docente/:path*", "/estudiante/:path*", "/administrador/:path*"],
};
