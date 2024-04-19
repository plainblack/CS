CREATE TABLE `datasetrows` (
    `id` varchar(36) NOT NULL DEFAULT 'uuid-will-be-generated', `createdAt` timestamp NOT NULL DEFAULT(now()), `updatedAt` timestamp NOT NULL DEFAULT(now()) ON UPDATE CURRENT_TIMESTAMP, `name` varchar(60) NOT NULL DEFAULT '', `quantity` int NOT NULL DEFAULT 1, `fields` json NOT NULL DEFAULT('{}'), `datasetId` varchar(36) NOT NULL, CONSTRAINT `datasetrows_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
DROP TABLE `rows`;
--> statement-breakpoint
ALTER TABLE `datasetrows`
ADD CONSTRAINT `datasetrows_dataset_6c3eb48a_fk` FOREIGN KEY (`datasetId`) REFERENCES `datasets` (`id`) ON DELETE cascade ON UPDATE cascade;