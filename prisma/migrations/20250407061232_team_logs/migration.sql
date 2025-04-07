-- CreateTable
CREATE TABLE `TeamLog` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATED', 'DELETED', 'MEMBER_ADDED', 'MEMBER_REMOVED', 'ROLE_UPDATED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `message` VARCHAR(191) NULL,
    `targetUserId` VARCHAR(191) NULL,
    `targetRoleId` VARCHAR(191) NULL,
    `metadata` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeamLog` ADD CONSTRAINT `TeamLog_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamLog` ADD CONSTRAINT `TeamLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamLog` ADD CONSTRAINT `TeamLog_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamLog` ADD CONSTRAINT `TeamLog_targetRoleId_fkey` FOREIGN KEY (`targetRoleId`) REFERENCES `TeamRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
