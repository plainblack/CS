import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, varchar, text, int, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {DatasetTable} from '#ving/drizzle/schema/Dataset.mjs';


export const RowTable = mysqlTable('datasetrows',
    {
        id: varchar('id', { length: 36 }).notNull().default('uuid-will-be-generated').primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		name: varchar('name', { length: 60 }).notNull().default(''),
		quantity: int('quantity').notNull().default(1),
		fields: json('fields').notNull().default({}),
		datasetId: varchar('datasetId', { length: 36 }).notNull()
    }, 
    (table) => ({
        datasetrows_dataset_6c3eb48a_fk: foreignKey({ name: "datasetrows_dataset_6c3eb48a_fk", columns: [table.datasetId], foreignColumns: [DatasetTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

