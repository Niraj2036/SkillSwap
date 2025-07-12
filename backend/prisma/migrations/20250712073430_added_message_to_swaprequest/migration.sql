/*
  Warnings:

  - Added the required column `message` to the `swapRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "swapRequest" ADD COLUMN     "message" TEXT NOT NULL;
