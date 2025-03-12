-- DropForeignKey
ALTER TABLE `BoardLog` DROP FOREIGN KEY `BoardLog_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `MergeRequest` DROP FOREIGN KEY `MergeRequest_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `ReviewRequest_boardId_fkey`;

-- AddForeignKey
ALTER TABLE `MergeRequest` ADD CONSTRAINT `MergeRequest_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardLog` ADD CONSTRAINT `BoardLog_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
