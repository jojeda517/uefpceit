/*
  Warnings:

  - You are about to drop the column `mATRICULAId` on the `CALIFICACION` table. All the data in the column will be lost.
  - You are about to drop the column `idMatricula` on the `EXAMEN` table. All the data in the column will be lost.
  - You are about to drop the column `mATRICULAId` on the `EXAMEN` table. All the data in the column will be lost.
  - Added the required column `estado` to the `CALIFICACION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCalificacion` to the `EXAMEN` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CALIFICACION" DROP CONSTRAINT "CALIFICACION_mATRICULAId_fkey";

-- DropForeignKey
ALTER TABLE "EXAMEN" DROP CONSTRAINT "EXAMEN_mATRICULAId_fkey";

-- AlterTable
ALTER TABLE "CALIFICACION" DROP COLUMN "mATRICULAId",
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "notaSupletorio" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "EXAMEN" DROP COLUMN "idMatricula",
DROP COLUMN "mATRICULAId",
ADD COLUMN     "idCalificacion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PARCIAL" ADD COLUMN     "mETODOEVALUACIONId" INTEGER;

-- CreateTable
CREATE TABLE "SUPLETORIO" (
    "id" SERIAL NOT NULL,
    "idCalificacion" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nota" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SUPLETORIO_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PARCIAL" ADD CONSTRAINT "PARCIAL_mETODOEVALUACIONId_fkey" FOREIGN KEY ("mETODOEVALUACIONId") REFERENCES "METODOEVALUACION"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CALIFICACION" ADD CONSTRAINT "CALIFICACION_idMatricula_fkey" FOREIGN KEY ("idMatricula") REFERENCES "MATRICULA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EXAMEN" ADD CONSTRAINT "EXAMEN_idCalificacion_fkey" FOREIGN KEY ("idCalificacion") REFERENCES "CALIFICACION"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUPLETORIO" ADD CONSTRAINT "SUPLETORIO_idCalificacion_fkey" FOREIGN KEY ("idCalificacion") REFERENCES "CALIFICACION"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
