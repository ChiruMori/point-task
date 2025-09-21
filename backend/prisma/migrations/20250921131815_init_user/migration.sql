-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'normal');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "uname" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'normal',
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uname_key" ON "public"."User"("uname");
