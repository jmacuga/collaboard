/*
  Warnings:

  - You are about to drop the `Stage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Stage` DROP FOREIGN KEY `Stage_boardId_fkey`;

-- DropTable
DROP TABLE `Stage`;
