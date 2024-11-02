/*
  Warnings:

  - You are about to drop the column `mETODOEVALUACIONId` on the `PARCIAL` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PARCIAL" DROP CONSTRAINT "PARCIAL_mETODOEVALUACIONId_fkey";

-- AlterTable
ALTER TABLE "PARCIAL" DROP COLUMN "mETODOEVALUACIONId",
ADD COLUMN     "idEvaluacionPertenece" INTEGER;

-- AddForeignKey
ALTER TABLE "PARCIAL" ADD CONSTRAINT "PARCIAL_idEvaluacionPertenece_fkey" FOREIGN KEY ("idEvaluacionPertenece") REFERENCES "EVALUACION"("id") ON DELETE SET NULL ON UPDATE CASCADE;
