/*
  Warnings:

  - The primary key for the `campus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `DIR_CAM` on the `campus` table. All the data in the column will be lost.
  - You are about to drop the column `ID_CAM` on the `campus` table. All the data in the column will be lost.
  - You are about to drop the column `NOM_CAM` on the `campus` table. All the data in the column will be lost.
  - The primary key for the `detalle_rol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_DET_ROL` on the `detalle_rol` table. All the data in the column will be lost.
  - You are about to drop the column `ID_ROL_PER` on the `detalle_rol` table. All the data in the column will be lost.
  - You are about to drop the column `ID_USU_PER` on the `detalle_rol` table. All the data in the column will be lost.
  - The primary key for the `rol` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_ROL` on the `rol` table. All the data in the column will be lost.
  - You are about to drop the column `ROL` on the `rol` table. All the data in the column will be lost.
  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `APE1_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `APE2_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `CED_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `CON_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `COR_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `EST_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `ID_CAM_PER` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `ID_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `NOM1_USU` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `NOM2_USU` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correo]` on the table `USUARIO` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `CAMPUS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `CAMPUS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRolPertenece` to the `DETALLE_ROL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUsuarioPertenece` to the `DETALLE_ROL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `ROL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `ROL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasena` to the `USUARIO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `USUARIO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `USUARIO` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Usuario_COR_USU_key` ON `usuario`;

-- AlterTable
ALTER TABLE `campus` DROP PRIMARY KEY,
    DROP COLUMN `DIR_CAM`,
    DROP COLUMN `ID_CAM`,
    DROP COLUMN `NOM_CAM`,
    ADD COLUMN `direccion` VARCHAR(255) NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nombre` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `detalle_rol` DROP PRIMARY KEY,
    DROP COLUMN `ID_DET_ROL`,
    DROP COLUMN `ID_ROL_PER`,
    DROP COLUMN `ID_USU_PER`,
    ADD COLUMN `idRolPertenece` INTEGER NOT NULL,
    ADD COLUMN `idUsuarioPertenece` INTEGER NOT NULL,
    ADD PRIMARY KEY (`idRolPertenece`, `idUsuarioPertenece`);

-- AlterTable
ALTER TABLE `rol` DROP PRIMARY KEY,
    DROP COLUMN `ID_ROL`,
    DROP COLUMN `ROL`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `rol` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `usuario` DROP PRIMARY KEY,
    DROP COLUMN `APE1_USU`,
    DROP COLUMN `APE2_USU`,
    DROP COLUMN `CED_USU`,
    DROP COLUMN `CON_USU`,
    DROP COLUMN `COR_USU`,
    DROP COLUMN `EST_USU`,
    DROP COLUMN `ID_CAM_PER`,
    DROP COLUMN `ID_USU`,
    DROP COLUMN `NOM1_USU`,
    DROP COLUMN `NOM2_USU`,
    ADD COLUMN `contrasena` VARCHAR(255) NOT NULL,
    ADD COLUMN `correo` VARCHAR(255) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `PERSONA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCampusPertenece` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `cedula` VARCHAR(10) NOT NULL,
    `estado` BOOLEAN NULL,
    `direccion` VARCHAR(100) NULL,
    `fechaNacimiento` DATETIME(3) NULL,
    `nacionalidad` VARCHAR(100) NULL,
    `paisOrigen` VARCHAR(100) NULL,
    `telefono` VARCHAR(10) NULL,

    UNIQUE INDEX `PERSONA_cedula_key`(`cedula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ESTADO_CIVIL` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estadoCivil` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ETNIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etnia` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discapacidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(50) NOT NULL,
    `porcentaje` INTEGER NULL,

    UNIQUE INDEX `Discapacidad_tipo_key`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLE_DISCAPACIDAD` (
    `idDiscapacidadPertenece` INTEGER NOT NULL,
    `idEstudiantePertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idDiscapacidadPertenece`, `idEstudiantePertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ESTUDIANTE` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPersonaPertenece` INTEGER NOT NULL,
    `idEstadoCivilPertenece` INTEGER NOT NULL,
    `idEtniaPertenece` INTEGER NOT NULL,
    `idRepresentantePertenece` INTEGER NOT NULL,
    `trabaja` BOOLEAN NOT NULL,
    `nombreTrabajo` VARCHAR(255) NULL,
    `tieneHijo` BOOLEAN NOT NULL,
    `rangoEdadHijo` VARCHAR(50) NULL,
    `bonoMies` BOOLEAN NOT NULL,
    `numeroCarnetDiscapacidad` VARCHAR(50) NULL,

    UNIQUE INDEX `ESTUDIANTE_idPersonaPertenece_key`(`idPersonaPertenece`),
    UNIQUE INDEX `ESTUDIANTE_numeroCarnetDiscapacidad_key`(`numeroCarnetDiscapacidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `REPRESENTANTE` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cedula` VARCHAR(10) NOT NULL,
    `nombre` VARCHAR(50) NOT NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `direccion` VARCHAR(100) NULL,
    `telefono` VARCHAR(10) NULL,

    UNIQUE INDEX `REPRESENTANTE_cedula_key`(`cedula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DOCENTE` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPersonaPertenece` INTEGER NOT NULL,
    `titulo` VARCHAR(100) NULL,
    `fechaIngreso` DATETIME(3) NULL,
    `fechaSalida` DATETIME(3) NULL,

    UNIQUE INDEX `DOCENTE_idPersonaPertenece_key`(`idPersonaPertenece`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipoPeriodo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoPeriodo` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `tipoPeriodo_tipoPeriodo_key`(`tipoPeriodo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modalidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modalidad` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `modalidad_modalidad_key`(`modalidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PERIODO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTipoPeriodoPertenece` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NULL,

    UNIQUE INDEX `PERIODO_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CURSO` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(100) NULL,

    UNIQUE INDEX `CURSO_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MATERIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(100) NULL,

    UNIQUE INDEX `MATERIA_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLECURSOMATERIADOCENTE` (
    `idCursoPertenece` INTEGER NOT NULL,
    `idMateriaPertenece` INTEGER NOT NULL,
    `idDocentePertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idCursoPertenece`, `idMateriaPertenece`, `idDocentePertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DETALLEESPECIALIDADCURSO` (
    `idEspecialidadPertenece` INTEGER NOT NULL,
    `idCursoPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`idEspecialidadPertenece`, `idCursoPertenece`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ESPECIALIDAD` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(100) NULL,

    UNIQUE INDEX `ESPECIALIDAD_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CALIFICACION` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstudiantePertenece` INTEGER NOT NULL,
    `idCursoPertenece` INTEGER NOT NULL,
    `idMateriaPertenece` INTEGER NOT NULL,
    `calificacion` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `USUARIO_correo_key` ON `USUARIO`(`correo`);

-- AddForeignKey
ALTER TABLE `DETALLE_ROL` ADD CONSTRAINT `DETALLE_ROL_idRolPertenece_fkey` FOREIGN KEY (`idRolPertenece`) REFERENCES `ROL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLE_ROL` ADD CONSTRAINT `DETALLE_ROL_idUsuarioPertenece_fkey` FOREIGN KEY (`idUsuarioPertenece`) REFERENCES `USUARIO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PERSONA` ADD CONSTRAINT `PERSONA_idCampusPertenece_fkey` FOREIGN KEY (`idCampusPertenece`) REFERENCES `CAMPUS`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLE_DISCAPACIDAD` ADD CONSTRAINT `DETALLE_DISCAPACIDAD_idDiscapacidadPertenece_fkey` FOREIGN KEY (`idDiscapacidadPertenece`) REFERENCES `Discapacidad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLE_DISCAPACIDAD` ADD CONSTRAINT `DETALLE_DISCAPACIDAD_idEstudiantePertenece_fkey` FOREIGN KEY (`idEstudiantePertenece`) REFERENCES `ESTUDIANTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ESTUDIANTE` ADD CONSTRAINT `ESTUDIANTE_idEstadoCivilPertenece_fkey` FOREIGN KEY (`idEstadoCivilPertenece`) REFERENCES `ESTADO_CIVIL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ESTUDIANTE` ADD CONSTRAINT `ESTUDIANTE_idEtniaPertenece_fkey` FOREIGN KEY (`idEtniaPertenece`) REFERENCES `ETNIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ESTUDIANTE` ADD CONSTRAINT `ESTUDIANTE_idRepresentantePertenece_fkey` FOREIGN KEY (`idRepresentantePertenece`) REFERENCES `REPRESENTANTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ESTUDIANTE` ADD CONSTRAINT `ESTUDIANTE_idPersonaPertenece_fkey` FOREIGN KEY (`idPersonaPertenece`) REFERENCES `PERSONA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DOCENTE` ADD CONSTRAINT `DOCENTE_idPersonaPertenece_fkey` FOREIGN KEY (`idPersonaPertenece`) REFERENCES `PERSONA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PERIODO` ADD CONSTRAINT `PERIODO_idTipoPeriodoPertenece_fkey` FOREIGN KEY (`idTipoPeriodoPertenece`) REFERENCES `tipoPeriodo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLECURSOMATERIADOCENTE` ADD CONSTRAINT `DETALLECURSOMATERIADOCENTE_idCursoPertenece_fkey` FOREIGN KEY (`idCursoPertenece`) REFERENCES `CURSO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLECURSOMATERIADOCENTE` ADD CONSTRAINT `DETALLECURSOMATERIADOCENTE_idMateriaPertenece_fkey` FOREIGN KEY (`idMateriaPertenece`) REFERENCES `MATERIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLECURSOMATERIADOCENTE` ADD CONSTRAINT `DETALLECURSOMATERIADOCENTE_idDocentePertenece_fkey` FOREIGN KEY (`idDocentePertenece`) REFERENCES `DOCENTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEESPECIALIDADCURSO` ADD CONSTRAINT `DETALLEESPECIALIDADCURSO_idEspecialidadPertenece_fkey` FOREIGN KEY (`idEspecialidadPertenece`) REFERENCES `ESPECIALIDAD`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DETALLEESPECIALIDADCURSO` ADD CONSTRAINT `DETALLEESPECIALIDADCURSO_idCursoPertenece_fkey` FOREIGN KEY (`idCursoPertenece`) REFERENCES `CURSO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idEstudiantePertenece_fkey` FOREIGN KEY (`idEstudiantePertenece`) REFERENCES `ESTUDIANTE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idCursoPertenece_fkey` FOREIGN KEY (`idCursoPertenece`) REFERENCES `CURSO`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CALIFICACION` ADD CONSTRAINT `CALIFICACION_idMateriaPertenece_fkey` FOREIGN KEY (`idMateriaPertenece`) REFERENCES `MATERIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
