/*
  Warnings:

  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `MATRICULA_idDocentePertenece_fkey`;

-- AlterTable
ALTER TABLE `matricula` MODIFY `idDocentePertenece` INTEGER NULL;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `MATRICULA` ADD CONSTRAINT `MATRICULA_idDocentePertenece_fkey` FOREIGN KEY (`idDocentePertenece`) REFERENCES `DOCENTE`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
