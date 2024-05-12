import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, char, varchar, text, int, bigint, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {DatasetTable} from '#ving/drizzle/schema/Dataset.mjs';


export const RowTable = mysqlTable('datasetrows',
    {
        id: bigint('id', {mode:'number', unsigned: true}).notNull().autoincrement().primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		name: varchar('name', { length: 60 }).notNull().default(''),
		quantity: int('quantity').notNull().default(1),
		fields: json('fields').notNull().default({}),
		datasetId: bigint('datasetId', {mode:'number', unsigned: true}).notNull()
    }, 
    (table) => ({
        name_datasetId_47b82ff_uq: unique('name_datasetId_47b82ff_uq').on(table.name, table.datasetId),
		datasetrows_dataset_6c3eb48a_fk: foreignKey({ name: "datasetrows_dataset_6c3eb48a_fk", columns: [table.datasetId], foreignColumns: [DatasetTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

