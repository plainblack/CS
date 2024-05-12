CREATE TABLE `apikeys` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`url` text NOT NULL,
	`reason` text NOT NULL,
	`privateKey` varchar(39) NOT NULL DEFAULT '',
	`userId` bigint unsigned NOT NULL,
	CONSTRAINT `apikeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaborators` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`gameId` bigint unsigned NOT NULL,
	`userId` bigint unsigned NOT NULL,
	CONSTRAINT `collaborators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasets` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`enumerateOn` varchar(255) NOT NULL DEFAULT '',
	`sheetsUrl` varchar(255) NOT NULL DEFAULT '',
	`fields` json NOT NULL DEFAULT ('{}'),
	`fieldSchema` json NOT NULL DEFAULT ('{}'),
	`rowFieldOrder` json NOT NULL DEFAULT ('[]'),
	`rowSchema` json NOT NULL DEFAULT ('{}'),
	`gameId` bigint unsigned NOT NULL,
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`notes` mediumtext NOT NULL,
	`fieldSchema` json NOT NULL DEFAULT ('{}'),
	`fields` json NOT NULL DEFAULT ('{}'),
	`userId` bigint unsigned NOT NULL,
	`archived` boolean NOT NULL DEFAULT false,
	`collection` varchar(60) NOT NULL DEFAULT '',
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasetrows` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`quantity` int NOT NULL DEFAULT 1,
	`fields` json NOT NULL DEFAULT ('{}'),
	`datasetId` bigint unsigned NOT NULL,
	CONSTRAINT `datasetrows_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_datasetId_47b82ff_uq` UNIQUE(`name`,`datasetId`)
);
--> statement-breakpoint
CREATE TABLE `s3files` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`filename` varchar(256) NOT NULL DEFAULT '',
	`extension` varchar(10) NOT NULL DEFAULT '',
	`contentType` varchar(256) NOT NULL DEFAULT '',
	`s3folder` varchar(256) NOT NULL DEFAULT '',
	`sizeInBytes` int NOT NULL DEFAULT 0,
	`metadata` json NOT NULL DEFAULT ('{}'),
	`status` enum('pending','ready','postProcessingFailed','verifyFailed') NOT NULL DEFAULT 'pending',
	`icon` enum('pending','thumbnail','extension','self') NOT NULL DEFAULT 'pending',
	`userId` bigint unsigned NOT NULL,
	CONSTRAINT `s3files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`username` varchar(60) NOT NULL DEFAULT '',
	`email` varchar(256) NOT NULL DEFAULT '',
	`realName` varchar(60) NOT NULL DEFAULT '',
	`password` varchar(256) NOT NULL DEFAULT 'no-password-specified',
	`passwordType` enum('bcrypt') NOT NULL DEFAULT 'bcrypt',
	`useAsDisplayName` enum('username','email','realName') NOT NULL DEFAULT 'username',
	`verifiedEmail` boolean NOT NULL DEFAULT false,
	`admin` boolean NOT NULL DEFAULT false,
	`developer` boolean NOT NULL DEFAULT false,
	`avatarType` enum('robot','uploaded') NOT NULL DEFAULT 'robot',
	`bio` mediumtext NOT NULL,
	`avatarId` bigint unsigned DEFAULT null,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `usernameIndex` UNIQUE(`username`),
	CONSTRAINT `emailIndex` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `apikeys` ADD CONSTRAINT `apikeys_user_90ada4_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `collaborators` ADD CONSTRAINT `collaborators_game_471c583c_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `collaborators` ADD CONSTRAINT `collaborators_user_4715b863_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `datasets` ADD CONSTRAINT `datasets_game_7582ceb6_fk` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_user_5adf0289_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `datasetrows` ADD CONSTRAINT `datasetrows_dataset_6c3eb48a_fk` FOREIGN KEY (`datasetId`) REFERENCES `datasets`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `s3files` ADD CONSTRAINT `s3files_user_40cb3d4d_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_avatar_39d62890_fk` FOREIGN KEY (`avatarId`) REFERENCES `s3files`(`id`) ON DELETE set null ON UPDATE no action;