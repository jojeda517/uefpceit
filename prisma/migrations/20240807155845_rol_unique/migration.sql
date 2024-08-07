/*
  Warnings:

  - A unique constraint covering the columns `[rol]` on the table `ROL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ROL_rol_key` ON `ROL`(`rol`);
