/*
  Warnings:

  - The values [SYNCED,FAILED] on the enum `ReplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isFolder` on the `FileObject` table. All the data in the column will be lost.
  - You are about to alter the column `sizeBytes` on the `FileObject` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ReplicationStatus_new" AS ENUM ('PENDING', 'DONE', 'ERROR');
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" DROP DEFAULT;
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" TYPE "public"."ReplicationStatus_new" USING ("replicationStatus"::text::"public"."ReplicationStatus_new");
ALTER TYPE "public"."ReplicationStatus" RENAME TO "ReplicationStatus_old";
ALTER TYPE "public"."ReplicationStatus_new" RENAME TO "ReplicationStatus";
DROP TYPE "public"."ReplicationStatus_old";
ALTER TABLE "public"."FileObject" ALTER COLUMN "replicationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "public"."FileObject" DROP COLUMN "isFolder",
ALTER COLUMN "sizeBytes" SET DATA TYPE INTEGER;
