CREATE TABLE `datasets` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`enumerateOn` varchar(255) NOT NULL DEFAULT '',
	`sheetsUrl` varchar(255) NOT NULL DEFAULT '',
	`fields` json NOT NULL DEFAULT ('{}'),
	`fieldSchema` json NOT NULL DEFAULT ('{}'),
	`rowFieldOrder` json NOT NULL DEFAULT ('[]'),
	`rowSchema` json NOT NULL DEFAULT ('{}'),
	`gameId` varchar(36) NOT NULL,
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rows` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`quantity` int NOT NULL DEFAULT 1,
	`fields` json NOT NULL DEFAULT ('{}'),
	`datasetId` varchar(36) NOT NULL,
	CONSTRAINT `rows_id` PRIMARY KEY(`id`),
	CONSTRAINT `nameIndex` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `datasets` ADD CONSTRAINT `datasets_game_7582ceb6_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `rows` ADD CONSTRAINT `rows_dataset_7bbf412_fk` FOREIGN KEY (`datasetId`) REFERENCES `datasets`(`id`) ON DELETE cascade ON UPDATE cascade;