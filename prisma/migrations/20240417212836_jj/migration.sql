/*
  Warnings:

  - Made the column `NOM1_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `NOM2_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `APE1_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `APE2_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `COR_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CON_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CED_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `EST_USU` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `usuario` MODIFY `NOM1_USU` VARCHAR(50) NOT NULL,
    MODIFY `NOM2_USU` VARCHAR(50) NOT NULL,
    MODIFY `APE1_USU` VARCHAR(50) NOT NULL,
    MODIFY `APE2_USU` VARCHAR(50) NOT NULL,
    MODIFY `COR_USU` VARCHAR(100) NOT NULL,
    MODIFY `CON_USU` VARCHAR(255) NOT NULL,
    MODIFY `CED_USU` VARCHAR(10) NOT NULL,
    MODIFY `EST_USU` BOOLEAN NOT NULL;
