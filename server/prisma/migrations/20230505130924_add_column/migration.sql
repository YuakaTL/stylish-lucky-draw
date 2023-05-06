/*
  Warnings:

  - Added the required column `member_name` to the `Info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Info` ADD COLUMN `member_name` VARCHAR(191) NOT NULL;
