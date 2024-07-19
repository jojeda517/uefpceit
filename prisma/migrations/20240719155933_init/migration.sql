/*
  Warnings:

  - You are about to drop the column `calificacion` on the `calificacion` table. All the data in the column will be lost.
  - Added the required column `idPeriodoPertenece` to the `CALIFICACION` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calificacion` DROP COLUMN `calificacion`,
    ADD COLUMN `aporte1` DOUBLE NULL,
    ADD COLUMN `aporte2` DOUBLE NULL,
    ADD COLUMN `aporte3` DOUBLE NULL,
    ADD COLUMN `examen` DOUBLE NULL,
    ADD COLUMN `idPeriodoPertenece` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `APORTE` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCalificacionPertenece` INTEGER NOT NULL,
    `tipoAporte` VARCHAR(100) NOT NULL,
    `valor` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idPeriodoPertenece_fkey` FOREIGN KEY (`idPeriodoPertenece`) REFERENCES `PERIODO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `APORTE` ADD CONSTRAINT `APORTE_idCalificacionPertenece_fkey` FOREIGN KEY (`idCalificacionPertenece`) REFERENCES `CALIFICACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
