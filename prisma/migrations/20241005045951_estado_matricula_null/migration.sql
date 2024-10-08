/*
  Warnings:

  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `matricula` MODIFY `estado` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;
