-- DropForeignKey
ALTER TABLE `UserLastViewedLog` DROP FOREIGN KEY `UserLastViewedLog_userId_fkey`;

-- DropIndex
DROP INDEX `UserLastViewedLog_userId_type_key` ON `UserLastViewedLog`;

-- AddForeignKey
ALTER TABLE `UserLastViewedLog` ADD CONSTRAINT `UserLastViewedLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
