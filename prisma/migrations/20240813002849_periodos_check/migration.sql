/*
  Warnings:

  - You are about to drop the column `idMetodoEvaluacion` on the `evaluacion` table. All the data in the column will be lost.
  - You are about to drop the column `idMetodoEvaluacion` on the `periodo` table. All the data in the column will be lost.
  - Added the required column `idMetodoEvaluacionPertenece` to the `EVALUACION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idEvaluacionPertenece` to the `PERIODO` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `evaluacion` DROP FOREIGN KEY `EVALUACION_idMetodoEvaluacion_fkey`;

-- DropForeignKey
ALTER TABLE `periodo` DROP FOREIGN KEY `PERIODO_idMetodoEvaluacion_fkey`;

-- AlterTable
ALTER TABLE `evaluacion` DROP COLUMN `idMetodoEvaluacion`,
    ADD COLUMN `idMetodoEvaluacionPertenece` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `periodo` DROP COLUMN `idMetodoEvaluacion`,
    ADD COLUMN `idEvaluacionPertenece` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PERIODO` ADD CONSTRAINT `PERIODO_idEvaluacionPertenece_fkey` FOREIGN KEY (`idEvaluacionPertenece`) REFERENCES `EVALUACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EVALUACION` ADD CONSTRAINT `EVALUACION_idMetodoEvaluacionPertenece_fkey` FOREIGN KEY (`idMetodoEvaluacionPertenece`) REFERENCES `METODOEVALUACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
