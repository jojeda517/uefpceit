/*
  Warnings:

  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `idCampusPertenece` to the `DETALLENIVELPARALELO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idEspecialidadPertenece` to the `DETALLENIVELPARALELO` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CALIFICACION_idMatricula_fkey` ON `calificacion`;

-- DropIndex
DROP INDEX `EXAMEN_idMatricula_fkey` ON `examen`;

-- AlterTable
ALTER TABLE `detallenivelparalelo` ADD COLUMN `idCampusPertenece` INTEGER NOT NULL,
    ADD COLUMN `idEspecialidadPertenece` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `DETALLENIVELPARALELO` ADD CONSTRAINT `DETALLENIVELPARALELO_idCampusPertenece_idEspecialidadPerten_fkey` FOREIGN KEY (`idCampusPertenece`, `idEspecialidadPertenece`) REFERENCES `DETALLECAMPUSESPECIALIDAD`(`idCampusPertenece`, `idEspecialidadPertenece`) ON DELETE RESTRICT ON UPDATE CASCADE;
