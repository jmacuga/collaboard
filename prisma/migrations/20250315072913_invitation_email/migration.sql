/*
  Warnings:

  - You are about to drop the column `inviteeId` on the `TeamInvitation` table. All the data in the column will be lost.
  - Added the required column `email` to the `TeamInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TeamInvitation` DROP FOREIGN KEY `TeamInvitation_inviteeId_fkey`;

-- AlterTable
ALTER TABLE `TeamInvitation` DROP COLUMN `inviteeId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
