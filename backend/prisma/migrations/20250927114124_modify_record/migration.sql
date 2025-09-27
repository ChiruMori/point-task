/*
  Warnings:

  - The values [completed,failed] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `status` to the `TaskRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."RecordStatus" AS ENUM ('completed', 'failed');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TaskStatus_new" AS ENUM ('editing', 'active', 'ended');
ALTER TABLE "public"."Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Task" ALTER COLUMN "status" TYPE "public"."TaskStatus_new" USING ("status"::text::"public"."TaskStatus_new");
ALTER TYPE "public"."TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "public"."TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "public"."TaskStatus_old";
ALTER TABLE "public"."Task" ALTER COLUMN "status" SET DEFAULT 'editing';
COMMIT;

-- AlterTable
ALTER TABLE "public"."TaskRecord" ADD COLUMN     "status" "public"."RecordStatus" NOT NULL;
