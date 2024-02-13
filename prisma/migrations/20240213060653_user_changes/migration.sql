/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;
