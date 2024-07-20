/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EVibe" AS ENUM ('Historical', 'Budget', 'Couple_Friendly', 'Family_Friendly', 'Luxury');

-- CreateEnum
CREATE TYPE "EAmenities" AS ENUM ('Turkish_Bath', 'Shower', 'Sauna', 'Steam_Room', 'Jacuzzi', 'Pool', 'Shock_Pool');

-- CreateEnum
CREATE TYPE "EDays" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_belongsToId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "locationLink" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "adultPrice" DOUBLE PRECISION NOT NULL,
    "childPrice" DOUBLE PRECISION NOT NULL,
    "scrubPrice" DOUBLE PRECISION NOT NULL,
    "vibe" "EVibe" NOT NULL,
    "amenities" "EAmenities"[],
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL,
    "day" "EDays" NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "sex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
