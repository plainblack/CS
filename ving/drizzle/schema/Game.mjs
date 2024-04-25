import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, varchar, text, int, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {UserTable} from '#ving/drizzle/schema/User.mjs';


export const GameTable = mysqlTable('games',
    {
        id: varchar('id', { length: 36 }).notNull().default('uuid-will-be-generated').primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		name: varchar('name', { length: 60 }).notNull().default(''),
		notes: mediumText('notes').notNull(),
		fieldSchema: json('fieldSchema').notNull().default({}),
		fields: json('fields').notNull().default({}),
		userId: varchar('userId', { length: 36 }).notNull(),
		archived: boolean('archived').notNull().default(false),
		collection: varchar('collection', { length: 60 }).notNull().default('')
    }, 
    (table) => ({
        games_user_5adf0289_fk: foreignKey({ name: "games_user_5adf0289_fk", columns: [table.userId], foreignColumns: [UserTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

