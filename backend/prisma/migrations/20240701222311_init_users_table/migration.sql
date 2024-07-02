-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Treasurer', 'EBoardMember', 'GeneralBodyMember');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "googleUID" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "gradYear" INTEGER NOT NULL,
    "careerInterests" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
