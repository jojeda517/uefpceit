/*
  Warnings:

  - You are about to drop the column `idCalificacionPertenece` on the `aporte` table. All the data in the column will be lost.
  - You are about to drop the column `tipoAporte` on the `aporte` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `aporte` table. All the data in the column will be lost.
  - You are about to drop the column `idCursoPertenece` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `idEstudiantePertenece` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `idMateriaPertenece` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `idPeriodoPertenece` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `especialidad` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `especialidad` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `materia` table. All the data in the column will be lost.
  - You are about to alter the column `fechaFin` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `fechaInicio` on the `periodo` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `curso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detallecursomateriadocente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalleespecialidadcurso` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[especialidad]` on the table `ESPECIALIDAD` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aporte` to the `APORTE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCalificacion` to the `APORTE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idMatricula` to the `CALIFICACION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idParcial` to the `CALIFICACION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promedio` to the `CALIFICACION` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especialidad` to the `ESPECIALIDAD` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `aporte` DROP FOREIGN KEY `APORTE_idCalificacionPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `calificacion` DROP FOREIGN KEY `CALIFICACION_idCursoPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `calificacion` DROP FOREIGN KEY `CALIFICACION_idEstudiantePertenece_fkey`;

-- DropForeignKey
ALTER TABLE `calificacion` DROP FOREIGN KEY `CALIFICACION_idMateriaPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `calificacion` DROP FOREIGN KEY `CALIFICACION_idPeriodoPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `detallecursomateriadocente` DROP FOREIGN KEY `DETALLECURSOMATERIADOCENTE_idCursoPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `detallecursomateriadocente` DROP FOREIGN KEY `DETALLECURSOMATERIADOCENTE_idDocentePertenece_fkey`;

-- DropForeignKey
ALTER TABLE `detallecursomateriadocente` DROP FOREIGN KEY `DETALLECURSOMATERIADOCENTE_idMateriaPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `detalleespecialidadcurso` DROP FOREIGN KEY `DETALLEESPECIALIDADCURSO_idCursoPertenece_fkey`;

-- DropForeignKey
ALTER TABLE `detalleespecialidadcurso` DROP FOREIGN KEY `DETALLEESPECIALIDADCURSO_idEspecialidadPertenece_fkey`;

-- DropIndex
DROP INDEX `ESPECIALIDAD_nombre_key` ON `especialidad`;

-- AlterTable
ALTER TABLE `aporte` DROP COLUMN `idCalificacionPertenece`,
    DROP COLUMN `tipoAporte`,
    DROP COLUMN `valor`,
    ADD COLUMN `aporte` FLOAT NOT NULL,
    ADD COLUMN `idCalificacion` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `calificacion` DROP COLUMN `idCursoPertenece`,
    DROP COLUMN `idEstudiantePertenece`,
    DROP COLUMN `idMateriaPertenece`,
    DROP COLUMN `idPeriodoPertenece`,
    ADD COLUMN `idMatricula` INTEGER NOT NULL,
    ADD COLUMN `idParcial` INTEGER NOT NULL,
    ADD COLUMN `promedio` FLOAT NOT NULL;

-- AlterTable
ALTER TABLE `especialidad` DROP COLUMN `descripcion`,
    DROP COLUMN `nombre`,
    ADD COLUMN `especialidad` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `materia` DROP COLUMN `descripcion`,
    MODIFY `nombre` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `periodo` MODIFY `fechaFin` DATETIME NULL,
    MODIFY `fechaInicio` DATETIME NULL;

-- DropTable
DROP TABLE `curso`;

-- DropTable
DROP TABLE `detallecursomateriadocente`;

-- DropTable
DROP TABLE `detalleespecialidadcurso`;

-- CreateTable
CREATE TABLE `DETALLECAMPUSESPECIALIDAD` (
    `idCampusPertenece` INTEGER NOT NULL,
    `idEspecialidadPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idCampusPertenece`, `idEspecialidadPertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NIVEL` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nivel` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `NIVEL_nivel_key`(`nivel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLEESPECIALIDADNIVEL` (
    `idEspecialidadPertenece` INTEGER NOT NULL,
    `idNivelPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idEspecialidadPertenece`, `idNivelPertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PARALELO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paralelo` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `PARALELO_paralelo_key`(`paralelo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLENIVELPARALELO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idNivelPertenece` INTEGER NOT NULL,
    `idParaleloPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLEMATERIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMateriaPertenece` INTEGER NOT NULL,
    `idDetalleNivelParaleloPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Matricula` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDetalleMateriaPertenece` INTEGER NOT NULL,
    `idPeriodoPertenece` INTEGER NOT NULL,
    `idEstudiantePertenece` INTEGER NOT NULL,
    `idDocentePertenece` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PARCIAL` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parcial` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `PARCIAL_parcial_key`(`parcial`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EXAMEN` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMatricula` INTEGER NOT NULL,
    `nota` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ESPECIALIDAD_especialidad_key` ON `ESPECIALIDAD`(`especialidad`);

-- AddForeignKey
ALTER TABLE `DETALLECAMPUSESPECIALIDAD` ADD CONSTRAINT `DETALLECAMPUSESPECIALIDAD_idCampusPertenece_fkey` FOREIGN KEY (`idCampusPertenece`) REFERENCES `CAMPUS`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLECAMPUSESPECIALIDAD` ADD CONSTRAINT `DETALLECAMPUSESPECIALIDAD_idEspecialidadPertenece_fkey` FOREIGN KEY (`idEspecialidadPertenece`) REFERENCES `ESPECIALIDAD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEESPECIALIDADNIVEL` ADD CONSTRAINT `DETALLEESPECIALIDADNIVEL_idEspecialidadPertenece_fkey` FOREIGN KEY (`idEspecialidadPertenece`) REFERENCES `ESPECIALIDAD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEESPECIALIDADNIVEL` ADD CONSTRAINT `DETALLEESPECIALIDADNIVEL_idNivelPertenece_fkey` FOREIGN KEY (`idNivelPertenece`) REFERENCES `NIVEL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLENIVELPARALELO` ADD CONSTRAINT `DETALLENIVELPARALELO_idNivelPertenece_fkey` FOREIGN KEY (`idNivelPertenece`) REFERENCES `NIVEL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLENIVELPARALELO` ADD CONSTRAINT `DETALLENIVELPARALELO_idParaleloPertenece_fkey` FOREIGN KEY (`idParaleloPertenece`) REFERENCES `PARALELO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEMATERIA` ADD CONSTRAINT `DETALLEMATERIA_idMateriaPertenece_fkey` FOREIGN KEY (`idMateriaPertenece`) REFERENCES `MATERIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEMATERIA` ADD CONSTRAINT `DETALLEMATERIA_idDetalleNivelParaleloPertenece_fkey` FOREIGN KEY (`idDetalleNivelParaleloPertenece`) REFERENCES `DETALLENIVELPARALELO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_idDetalleMateriaPertenece_fkey` FOREIGN KEY (`idDetalleMateriaPertenece`) REFERENCES `DETALLEMATERIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_idPeriodoPertenece_fkey` FOREIGN KEY (`idPeriodoPertenece`) REFERENCES `PERIODO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_idEstudiantePertenece_fkey` FOREIGN KEY (`idEstudiantePertenece`) REFERENCES `ESTUDIANTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_idDocentePertenece_fkey` FOREIGN KEY (`idDocentePertenece`) REFERENCES `DOCENTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idParcial_fkey` FOREIGN KEY (`idParcial`) REFERENCES `PARCIAL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idMatricula_fkey` FOREIGN KEY (`idMatricula`) REFERENCES `Matricula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `APORTE` ADD CONSTRAINT `APORTE_idCalificacion_fkey` FOREIGN KEY (`idCalificacion`) REFERENCES `CALIFICACION`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EXAMEN` ADD CONSTRAINT `EXAMEN_idMatricula_fkey` FOREIGN KEY (`idMatricula`) REFERENCES `Matricula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
