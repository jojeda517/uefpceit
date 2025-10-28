/*
  Warnings:

  - You are about to drop the column `notaSupletorio` on the `CALIFICACION` table. All the data in the column will be lost.
  - You are about to drop the column `idCalificacion` on the `SUPLETORIO` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idMatricula]` on the table `SUPLETORIO` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idMatricula` to the `SUPLETORIO` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SUPLETORIO" DROP CONSTRAINT "SUPLETORIO_idCalificacion_fkey";

-- AlterTable
ALTER TABLE "CALIFICACION" DROP COLUMN "notaSupletorio";

-- AlterTable
ALTER TABLE "SUPLETORIO" DROP COLUMN "idCalificacion",
ADD COLUMN     "idMatricula" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SUPLETORIO_idMatricula_key" ON "SUPLETORIO"("idMatricula");

-- AddForeignKey
ALTER TABLE "SUPLETORIO" ADD CONSTRAINT "SUPLETORIO_idMatricula_fkey" FOREIGN KEY ("idMatricula") REFERENCES "MATRICULA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
