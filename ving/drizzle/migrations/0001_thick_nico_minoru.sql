CREATE TABLE `games` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`notes` mediumtext NOT NULL,
	`fieldSchema` json NOT NULL DEFAULT ('{}'),
	`fields` json NOT NULL DEFAULT ('{}'),
	`userId` varchar(36) NOT NULL,
	`archived` boolean NOT NULL DEFAULT false,
	`collection` varchar(60) NOT NULL DEFAULT '',
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_user_5adf0289_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;