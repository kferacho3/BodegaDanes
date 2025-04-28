/*
  Warnings:

  - A unique constraint covering the columns `[confirmationCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `confirmationCode` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "confirmationCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_confirmationCode_key" ON "Booking"("confirmationCode");
