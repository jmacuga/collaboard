-- DropForeignKey
ALTER TABLE `ReviewRequest` DROP FOREIGN KEY `ReviewRequest_mergeRequestId_fkey`;

-- AddForeignKey
ALTER TABLE `ReviewRequest` ADD CONSTRAINT `ReviewRequest_mergeRequestId_fkey` FOREIGN KEY (`mergeRequestId`) REFERENCES `MergeRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
