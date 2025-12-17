-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('UPLOADED', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" TEXT NOT NULL,
    "rawUrl" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
