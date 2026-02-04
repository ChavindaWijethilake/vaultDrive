-- CreateEnum
CREATE TYPE "public"."FileKind" AS ENUM ('FILE', 'FOLDER');

-- CreateEnum
CREATE TYPE "public"."ReplicationStatus" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "public"."FileObject" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL DEFAULT 'local-user',
    "kind" "public"."FileKind" NOT NULL,
    "isFolder" BOOLEAN NOT NULL DEFAULT false,
    "originalName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" BIGINT,
    "folderPath" TEXT NOT NULL DEFAULT '/',
    "localPath" TEXT,
    "cloudKey" TEXT,
    "replicationStatus" "public"."ReplicationStatus" NOT NULL DEFAULT 'PENDING',
    "replicationError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileObject_ownerId_createdAt_idx" ON "public"."FileObject"("ownerId", "createdAt");

-- CreateIndex
CREATE INDEX "FileObject_ownerId_folderPath_idx" ON "public"."FileObject"("ownerId", "folderPath");
