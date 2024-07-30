-- AlterTable
ALTER TABLE `persona` ADD COLUMN `idParroquiaPertenece` INTEGER NULL;

-- CreateTable
CREATE TABLE `PROVINCIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provincia` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `PROVINCIA_provincia_key`(`provincia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CANTON` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canton` VARCHAR(255) NOT NULL,
    `idProvinciaPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PARROQUIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parroquia` VARCHAR(255) NOT NULL,
    `idCantonPertenece` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PERSONA` ADD CONSTRAINT `PERSONA_idParroquiaPertenece_fkey` FOREIGN KEY (`idParroquiaPertenece`) REFERENCES `PARROQUIA`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CANTON` ADD CONSTRAINT `CANTON_idProvinciaPertenece_fkey` FOREIGN KEY (`idProvinciaPertenece`) REFERENCES `PROVINCIA`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PARROQUIA` ADD CONSTRAINT `PARROQUIA_idCantonPertenece_fkey` FOREIGN KEY (`idCantonPertenece`) REFERENCES `CANTON`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
