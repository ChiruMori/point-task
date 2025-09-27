/*
  Warnings:

  - Added the required column `remark` to the `TaskRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TaskRecord" ADD COLUMN     "remark" TEXT NOT NULL;
