/*
  Warnings:

  - You are about to drop the column `idTipoPeriodoPertenece` on the `periodo` table. All the data in the column will be lost.
  - You are about to drop the `tipoperiodo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idMetodoEvaluacion` to the `PERIODO` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `periodo` DROP FOREIGN KEY `PERIODO_idTipoPeriodoPertenece_fkey`;

-- AlterTable
ALTER TABLE `modalidad` MODIFY `modalidad` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `periodo` DROP COLUMN `idTipoPeriodoPertenece`,
    ADD COLUMN `idMetodoEvaluacion` INTEGER NOT NULL,
    MODIFY `nombre` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `tipoperiodo`;

-- CreateTable
CREATE TABLE `DETALLEPERIODOMODALIDAD` (
    `idPeriodoPertenece` INTEGER NOT NULL,
    `idModalidadPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idPeriodoPertenece`, `idModalidadPertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `METODOEVALUACION` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `metodo` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `METODOEVALUACION_metodo_key`(`metodo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EVALUACION` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `evaluacion` VARCHAR(100) NOT NULL,
    `idMetodoEvaluacion` INTEGER NOT NULL,

    UNIQUE INDEX `EVALUACION_evaluacion_key`(`evaluacion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DETALLEPERIODOMODALIDAD` ADD CONSTRAINT `DETALLEPERIODOMODALIDAD_idPeriodoPertenece_fkey` FOREIGN KEY (`idPeriodoPertenece`) REFERENCES `PERIODO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEPERIODOMODALIDAD` ADD CONSTRAINT `DETALLEPERIODOMODALIDAD_idModalidadPertenece_fkey` FOREIGN KEY (`idModalidadPertenece`) REFERENCES `MODALIDAD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PERIODO` ADD CONSTRAINT `PERIODO_idMetodoEvaluacion_fkey` FOREIGN KEY (`idMetodoEvaluacion`) REFERENCES `METODOEVALUACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EVALUACION` ADD CONSTRAINT `EVALUACION_idMetodoEvaluacion_fkey` FOREIGN KEY (`idMetodoEvaluacion`) REFERENCES `METODOEVALUACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
