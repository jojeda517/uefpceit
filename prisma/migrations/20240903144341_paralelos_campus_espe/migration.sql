/*
  Warnings:

  - You are about to drop the column `idCampusPertenece` on the `detallenivelparalelo` table. All the data in the column will be lost.
  - You are about to drop the column `idEspecialidadPertenece` on the `detallenivelparalelo` table. All the data in the column will be lost.
  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `detallenivelparalelo` DROP FOREIGN KEY `DETALLENIVELPARALELO_idCampusPertenece_idEspecialidadPerten_fkey`;

-- AlterTable
ALTER TABLE `detallenivelparalelo` DROP COLUMN `idCampusPertenece`,
    DROP COLUMN `idEspecialidadPertenece`;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;
