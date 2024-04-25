import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, varchar, text, int, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {GameTable} from '#ving/drizzle/schema/Game.mjs';


export const DatasetTable = mysqlTable('datasets',
    {
        id: varchar('id', { length: 36 }).notNull().default('uuid-will-be-generated').primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		name: varchar('name', { length: 60 }).notNull().default(''),
		enumerateOn: varchar('enumerateOn', { length: 255 }).notNull().default(''),
		sheetsUrl: varchar('sheetsUrl', { length: 255 }).notNull().default(''),
		fields: json('fields').notNull().default({}),
		fieldSchema: json('fieldSchema').notNull().default({}),
		rowFieldOrder: json('rowFieldOrder').notNull().default([]),
		rowSchema: json('rowSchema').notNull().default({}),
		gameId: varchar('gameId', { length: 36 }).notNull()
    }, 
    (table) => ({
        datasets_game_7582ceb6_fk: foreignKey({ name: "datasets_game_7582ceb6_fk", columns: [table.gameId], foreignColumns: [GameTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

