/* import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient(); */

import { PrismaClient } from "@prisma/client";

let prisma;

// Usamos un singleton para la instancia del cliente Prisma
if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}

prisma = globalThis.prisma;

// Exportamos la instancia
export default prisma;
