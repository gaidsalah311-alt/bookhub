CREATE TABLE `author_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`website` varchar(255),
	`socialLinks` json,
	`bio` text,
	`isVerified` boolean DEFAULT false,
	`verificationDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `author_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_author_user` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`description` text,
	`categoryId` int NOT NULL,
	`subcategoryId` int,
	`language` varchar(10) NOT NULL,
	`isbn` varchar(20),
	`publishDate` timestamp,
	`publisher` varchar(255),
	`pages` int,
	`coverImage` text,
	`images` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_isbn_unique` UNIQUE(`isbn`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`budget` decimal(10,2) NOT NULL,
	`spent` decimal(10,2) DEFAULT '0',
	`status` enum('active','paused','ended') DEFAULT 'active',
	`targetCountries` json,
	`targetCategories` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameFr` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`icon` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `categories_nameAr_unique` UNIQUE(`nameAr`),
	CONSTRAINT `categories_nameEn_unique` UNIQUE(`nameEn`),
	CONSTRAINT `categories_nameFr_unique` UNIQUE(`nameFr`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId1` int NOT NULL,
	`userId2` int NOT NULL,
	`listingId` int,
	`lastMessage` text,
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_conversation` UNIQUE(`userId1`,`userId2`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(2) NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255),
	`currency` varchar(10) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`listingId` int NOT NULL,
	`list` varchar(100) DEFAULT 'default',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_favorite` UNIQUE(`userId`,`listingId`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `follows_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_follow` UNIQUE(`followerId`,`followingId`)
);
--> statement-breakpoint
CREATE TABLE `library_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`libraryName` varchar(255) NOT NULL,
	`logo` text,
	`coverImage` text,
	`website` varchar(255),
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`bio` text,
	`isVerified` boolean DEFAULT false,
	`verificationDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `library_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_library_user` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`type` enum('paper','digital','external_link') NOT NULL,
	`condition` enum('new','like_new','good','fair') DEFAULT 'new',
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`country` varchar(100) NOT NULL,
	`externalLink` varchar(500),
	`externalPlatform` varchar(100),
	`description` text,
	`status` enum('active','sold','archived','pending_review') DEFAULT 'pending_review',
	`views` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`favorites` int DEFAULT 0,
	`isPremium` boolean DEFAULT false,
	`premiumTier` enum('standard','gold'),
	`premiumExpires` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`image` text,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`relatedId` int,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `premium_ads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`listingId` int NOT NULL,
	`tier` enum('gold','platinum') NOT NULL,
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`position` int,
	`clicks` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `premium_ads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publisher_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`publisherName` varchar(255) NOT NULL,
	`logo` text,
	`coverImage` text,
	`website` varchar(255),
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`bio` text,
	`isVerified` boolean DEFAULT false,
	`verificationDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publisher_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_publisher_user` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetUserId` int NOT NULL,
	`listingId` int,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`reportedUserId` int,
	`listingId` int,
	`reason` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','reviewed','resolved','dismissed') DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`type` varchar(50),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `subcategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameFr` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subcategories_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_subcat_slug` UNIQUE(`categoryId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`tier` enum('free','pro','publisher','library') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`duration` int NOT NULL,
	`maxListings` int,
	`features` json,
	`description` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscription_plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_plans_tier_unique` UNIQUE(`tier`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planId` int NOT NULL,
	`status` enum('active','cancelled','expired') DEFAULT 'active',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`autoRenew` boolean DEFAULT true,
	`paymentMethod` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','author','library','publisher','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `profileImage` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `language` varchar(10) DEFAULT 'ar';--> statement-breakpoint
ALTER TABLE `users` ADD `currency` varchar(10) DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `isBanned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','pro','publisher','library') DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionExpires` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `author_profiles` ADD CONSTRAINT `author_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_subcategoryId_subcategories_id_fk` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_userId1_users_id_fk` FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_userId2_users_id_fk` FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_followerId_users_id_fk` FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follows_followingId_users_id_fk` FOREIGN KEY (`followingId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `library_profiles` ADD CONSTRAINT `library_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listings` ADD CONSTRAINT `listings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listings` ADD CONSTRAINT `listings_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversationId_conversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `premium_ads` ADD CONSTRAINT `premium_ads_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publisher_profiles` ADD CONSTRAINT `publisher_profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_targetUserId_users_id_fk` FOREIGN KEY (`targetUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_reporterId_users_id_fk` FOREIGN KEY (`reporterId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_reportedUserId_users_id_fk` FOREIGN KEY (`reportedUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_listingId_listings_id_fk` FOREIGN KEY (`listingId`) REFERENCES `listings`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_planId_subscription_plans_id_fk` FOREIGN KEY (`planId`) REFERENCES `subscription_plans`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_title` ON `books` (`title`);--> statement-breakpoint
CREATE INDEX `idx_author` ON `books` (`author`);--> statement-breakpoint
CREATE INDEX `idx_slug` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_user_listings` ON `listings` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `listings` (`status`);--> statement-breakpoint
CREATE INDEX `idx_country` ON `listings` (`country`);--> statement-breakpoint
CREATE INDEX `idx_created` ON `listings` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_conversation` ON `messages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `idx_created` ON `messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_user_notifications` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_created` ON `notifications` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_country` ON `users` (`country`);--> statement-breakpoint
CREATE INDEX `idx_role` ON `users` (`role`);