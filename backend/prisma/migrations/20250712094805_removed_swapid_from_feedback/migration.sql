/*
  Warnings:

  - You are about to drop the column `swapId` on the `swapFeedback` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "swapFeedback" DROP CONSTRAINT "swapFeedback_swapId_fkey";

-- AlterTable
ALTER TABLE "swapFeedback" DROP COLUMN "swapId";
