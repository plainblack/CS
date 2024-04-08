CREATE TABLE `collaborators` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`gameId` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `collaborators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `collaborators` ADD CONSTRAINT `collaborators_game_471c583c_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `collaborators` ADD CONSTRAINT `collaborators_user_4715b863_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;