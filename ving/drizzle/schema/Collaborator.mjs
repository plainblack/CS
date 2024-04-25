import { boolean, mysqlEnum, mysqlTable, timestamp, datetime, uniqueIndex, unique, varchar, text, int, json, mediumText, foreignKey } from '#ving/drizzle/orm.mjs';
import {GameTable} from '#ving/drizzle/schema/Game.mjs';
import {UserTable} from '#ving/drizzle/schema/User.mjs';


export const CollaboratorTable = mysqlTable('collaborators',
    {
        id: varchar('id', { length: 36 }).notNull().default('uuid-will-be-generated').primaryKey(),
		createdAt: timestamp('createdAt').defaultNow().notNull(),
		updatedAt: timestamp('updatedAt').defaultNow().notNull().onUpdateNow(),
		gameId: varchar('gameId', { length: 36 }).notNull(),
		userId: varchar('userId', { length: 36 }).notNull()
    }, 
    (table) => ({
        collaborators_game_471c583c_fk: foreignKey({ name: "collaborators_game_471c583c_fk", columns: [table.gameId], foreignColumns: [GameTable.id]}).onDelete("cascade").onUpdate("cascade"),
		collaborators_user_4715b863_fk: foreignKey({ name: "collaborators_user_4715b863_fk", columns: [table.userId], foreignColumns: [UserTable.id]}).onDelete("cascade").onUpdate("cascade")
    })
);

