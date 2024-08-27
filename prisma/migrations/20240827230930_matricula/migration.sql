/*
  Warnings:

  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `calificacion` DROP FOREIGN KEY `CALIFICACION_idMatricula_fkey`;

-- DropForeignKey
ALTER TABLE `examen` DROP FOREIGN KEY `EXAMEN_idMatricula_fkey`;

-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_idDetalleMateriaPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_idDocentePertenece_fkey`;

-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_idEstudiantePertenece_fkey`;

-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_idPeriodoPertenece_fkey`;

-- AlterTable
ALTER TABLE `calificacion` ADD COLUMN `mATRICULAId` INTEGER NULL;

-- AlterTable
ALTER TABLE `examen` ADD COLUMN `mATRICULAId` INTEGER NULL;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `MATRICULA` ADD CONSTRAINT `MATRICULA_idDetalleMateriaPertenece_fkey` FOREIGN KEY (`idDetalleMateriaPertenece`) REFERENCES `DETALLEMATERIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MATRICULA` ADD CONSTRAINT `MATRICULA_idPeriodoPertenece_fkey` FOREIGN KEY (`idPeriodoPertenece`) REFERENCES `PERIODO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MATRICULA` ADD CONSTRAINT `MATRICULA_idEstudiantePertenece_fkey` FOREIGN KEY (`idEstudiantePertenece`) REFERENCES `ESTUDIANTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MATRICULA` ADD CONSTRAINT `MATRICULA_idDocentePertenece_fkey` FOREIGN KEY (`idDocentePertenece`) REFERENCES `DOCENTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_mATRICULAId_fkey` FOREIGN KEY (`mATRICULAId`) REFERENCES `MATRICULA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EXAMEN` ADD CONSTRAINT `EXAMEN_mATRICULAId_fkey` FOREIGN KEY (`mATRICULAId`) REFERENCES `MATRICULA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
