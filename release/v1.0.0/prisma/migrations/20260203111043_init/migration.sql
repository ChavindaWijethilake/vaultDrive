/*
  Warnings:

  - The values [DONE] on the enum `ReplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `storedName` to the `FileObject` table without a default value. This is not possible if the table is not empty.
  - Made the column `originalName` on table `FileObject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mimeType` on table `FileObject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeBytes` on table `FileObject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `localPath` on table `FileObject` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReplicationStatus_new" AS ENUM ('PENDING', 'SYNCED', 'FAILED');
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" DROP DEFAULT;
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" TYPE "public"."ReplicationStatus_new" USING ("replicationStatus"::text::"public"."ReplicationStatus_new");
ALTER TYPE "public"."ReplicationStatus" RENAME TO "ReplicationStatus_old";
ALTER TYPE "public"."ReplicationStatus_new" RENAME TO "ReplicationStatus";
DROP TYPE "public"."ReplicationStatus_old";
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."FileObject" ADD COLUMN     "storedName" TEXT NOT NULL,
ALTER COLUMN "ownerId" DROP DEFAULT,
ALTER COLUMN "originalName" SET NOT NULL,
ALTER COLUMN "mimeType" SET NOT NULL,
ALTER COLUMN "sizeBytes" SET NOT NULL,
ALTER COLUMN "folderPath" DROP DEFAULT,
ALTER COLUMN "localPath" SET NOT NULL;
