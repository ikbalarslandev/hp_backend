/*
  Warnings:

  - You are about to drop the column `adress` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `adultPrice` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `childPrice` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `locationLink` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `scrubPrice` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sex` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "adress",
DROP COLUMN "adultPrice",
DROP COLUMN "childPrice",
DROP COLUMN "locationLink",
DROP COLUMN "phone",
DROP COLUMN "scrubPrice",
ADD COLUMN     "contactId" TEXT,
ADD COLUMN     "priceId" TEXT,
ADD COLUMN     "sex" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "adult" DOUBLE PRECISION NOT NULL,
    "child" DOUBLE PRECISION NOT NULL,
    "scrub" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "districts" TEXT[],

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_city_key" ON "Province"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Property_id_key" ON "Property"("id");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;
