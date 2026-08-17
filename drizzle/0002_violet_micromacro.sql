CREATE TABLE `bookNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bookId` int NOT NULL,
	`note` text,
	`personalRating` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookNotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookNotesUserBookUnique` UNIQUE(`userId`,`bookId`)
);
--> statement-breakpoint
CREATE INDEX `bookNotesUserIdIdx` ON `bookNotes` (`userId`);--> statement-breakpoint
CREATE INDEX `bookNotesBookIdIdx` ON `bookNotes` (`bookId`);