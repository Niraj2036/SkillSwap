/*
  Warnings:

  - Added the required column `message` to the `swapFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "swapFeedback" ADD COLUMN     "message" TEXT NOT NULL;
