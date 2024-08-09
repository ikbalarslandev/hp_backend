/*
  Warnings:

  - The `location` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amenities` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Province` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `vibe` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "location",
ADD COLUMN     "location" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "pay" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratingId" TEXT,
DROP COLUMN "vibe",
ADD COLUMN     "vibe" INTEGER NOT NULL,
DROP COLUMN "amenities",
ADD COLUMN     "amenities" INTEGER[];

-- DropTable
DROP TABLE "Province";

-- DropEnum
DROP TYPE "EAmenities";

-- DropEnum
DROP TYPE "EVibe";

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name_tr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "details_tr" TEXT[],
    "details_en" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_title_key" ON "Property"("title");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
