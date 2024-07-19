/*
  Warnings:

  - You are about to drop the column `aporte1` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `aporte2` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `aporte3` on the `calificacion` table. All the data in the column will be lost.
  - You are about to drop the column `examen` on the `calificacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `calificacion` DROP COLUMN `aporte1`,
    DROP COLUMN `aporte2`,
    DROP COLUMN `aporte3`,
    DROP COLUMN `examen`;
