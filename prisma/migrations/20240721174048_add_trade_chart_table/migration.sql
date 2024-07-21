/*
  Warnings:

  - The primary key for the `trade_chart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `trade_chart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trade_chart" DROP CONSTRAINT "trade_chart_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "trade_chart_pkey" PRIMARY KEY ("pick_number");
