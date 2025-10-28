-- CreateTable
CREATE TABLE "CIERREPARCIAL" (
    "id" SERIAL NOT NULL,
    "idParcialPertenece" INTEGER NOT NULL,
    "idPeriodoPertenece" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL,

    CONSTRAINT "CIERREPARCIAL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CIERREPARCIAL_idParcialPertenece_idPeriodoPertenece_key" ON "CIERREPARCIAL"("idParcialPertenece", "idPeriodoPertenece");

-- AddForeignKey
ALTER TABLE "CIERREPARCIAL" ADD CONSTRAINT "CIERREPARCIAL_idParcialPertenece_fkey" FOREIGN KEY ("idParcialPertenece") REFERENCES "PARCIAL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CIERREPARCIAL" ADD CONSTRAINT "CIERREPARCIAL_idPeriodoPertenece_fkey" FOREIGN KEY ("idPeriodoPertenece") REFERENCES "PERIODO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
