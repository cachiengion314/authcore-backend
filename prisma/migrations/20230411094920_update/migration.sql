-- AlterTable
ALTER TABLE `posts` MODIFY `viewCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `likeCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('Editing', 'Published', 'Suspended', 'WaitingForApproval') NOT NULL DEFAULT 'Published';
