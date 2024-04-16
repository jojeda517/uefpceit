/*
  Warnings:

  - A unique constraint covering the columns `[COR_USU]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Usuario_COR_USU_key` ON `Usuario`(`COR_USU`);
