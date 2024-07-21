/*
  Warnings:

  - Made the column `team_name` on table `draft_capital` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "draft_capital" ALTER COLUMN "team_name" SET NOT NULL;
