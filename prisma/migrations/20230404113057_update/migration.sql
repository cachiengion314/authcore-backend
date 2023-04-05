/*
  Warnings:

  - You are about to drop the column `organizationName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `organizationName`,
    ADD COLUMN `tenantId` VARCHAR(191) NULL;
