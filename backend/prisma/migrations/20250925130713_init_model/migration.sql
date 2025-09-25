/*
  Warnings:

  - Added the required column `updateTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TaskFrequency" AS ENUM ('once', 'daily', 'workday', 'weekend', 'endless');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('editing', 'active', 'completed', 'expired');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateTime" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "freq" "public"."TaskFrequency" NOT NULL DEFAULT 'once',
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'editing',
    "creatorId" INTEGER NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3),
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reward" (
    "id" SERIAL NOT NULL,
    "fx" TEXT NOT NULL,
    "maxInput" INTEGER NOT NULL,
    "minInput" INTEGER NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaskRecord" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,
    "pointsAwarded" INTEGER NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskRecord_pkey" PRIMARY KEY ("id")
);
