CREATE TABLE `apikeys` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(60) NOT NULL DEFAULT '',
	`url` text NOT NULL,
	`reason` text NOT NULL,
	`privateKey` varchar(39) NOT NULL DEFAULT '',
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `apikeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `s3files` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
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
	`userId` varchar(36) NOT NULL,
	CONSTRAINT `s3files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated',
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
	`avatarId` varchar(36) DEFAULT null,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `usernameIndex` UNIQUE(`username`),
	CONSTRAINT `emailIndex` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `apikeys` ADD CONSTRAINT `apikeys_user_90ada4_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `s3files` ADD CONSTRAINT `s3files_user_40cb3d4d_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_avatar_39d62890_fk` FOREIGN KEY (`avatarId`) REFERENCES `s3files`(`id`) ON DELETE set null ON UPDATE no action;