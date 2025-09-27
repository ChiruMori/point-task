/*
  Warnings:

  - The values [expired] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `freq` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('normal', 'reward', 'punish');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TaskStatus_new" AS ENUM ('editing', 'active', 'completed', 'failed');
ALTER TABLE "public"."Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Task" ALTER COLUMN "status" TYPE "public"."TaskStatus_new" USING ("status"::text::"public"."TaskStatus_new");
ALTER TYPE "public"."TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "public"."TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "public"."Task" ALTER COLUMN "status" SET DEFAULT 'editing';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "freq",
ADD COLUMN     "type" "public"."TaskType" NOT NULL DEFAULT 'normal';

-- DropEnum
DROP TYPE "public"."TaskFrequency";
