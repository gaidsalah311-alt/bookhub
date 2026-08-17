ALTER TABLE `books` ADD `coverImageKey` text;--> statement-breakpoint
ALTER TABLE `books` ADD `coverImageMimeType` varchar(64);--> statement-breakpoint
ALTER TABLE `books` ADD `coverImageSize` int;