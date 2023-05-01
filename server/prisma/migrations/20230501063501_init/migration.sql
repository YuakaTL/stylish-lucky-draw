-- CreateTable
CREATE TABLE `Discount` (
    `discount_id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `discount_name` VARCHAR(191) NOT NULL,
    `discount_value` DOUBLE NOT NULL,
    `threshold` INTEGER NOT NULL,
    `inventory` INTEGER NOT NULL,

    INDEX `Discount_event_id_fkey`(`event_id`),
    PRIMARY KEY (`discount_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Info` (
    `lottery_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `discount_id` INTEGER NOT NULL,
    `coupon` VARCHAR(191) NOT NULL,
    `is_receive` BOOLEAN NOT NULL DEFAULT false,
    `is_used` BOOLEAN NOT NULL DEFAULT false,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Info_coupon_key`(`coupon`),
    INDEX `Info_discount_id_fkey`(`discount_id`),
    PRIMARY KEY (`lottery_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_name` VARCHAR(191) NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('pending', 'ongoing', 'cancelled', 'finished') NOT NULL DEFAULT 'pending',
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_update_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Info` ADD CONSTRAINT `Info_discount_id_fkey` FOREIGN KEY (`discount_id`) REFERENCES `Discount`(`discount_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
