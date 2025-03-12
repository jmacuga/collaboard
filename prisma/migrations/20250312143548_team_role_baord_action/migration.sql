/*
  Warnings:

  - A unique constraint covering the columns `[teamId,name]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `BoardAction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `TeamRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Board_teamId_name_key` ON `Board`(`teamId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `BoardAction_name_key` ON `BoardAction`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `TeamRole_name_key` ON `TeamRole`(`name`);
