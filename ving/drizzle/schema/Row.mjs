import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, varchar, text, int, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {DatasetTable} from '#ving/drizzle/schema/Dataset.mjs';


export const RowTable = mysqlTable('rows',
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
        rows_dataset_7bbf412_fk: foreignKey({ name: "rows_dataset_7bbf412_fk", columns: [table.datasetId], foreignColumns: [DatasetTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

