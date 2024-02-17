import { defineCommand } from "citty";
import { exec } from "child_process";
import { runMigrations } from '#ving/drizzle/migrate.mjs';
import { makeTableFile } from '#ving/schema/gentable.mjs';
import { vingSchemas } from '#ving/schema/map.mjs';

export default defineCommand({
    meta: {
        name: "Drizzle ORM",
        description: "Manage Drizzle migrations and code generation",
    },
    args: {
        tables: {
            type: "boolean",
            description: "Generate drizzle table files from ving schemas",
            alias: "t",
        },
        prepare: {
            type: "boolean",
            description: "Generate migration files from table changes",
            alias: "p",
        },
        up: {
            type: "boolean",
            description: "Run migrations",
            alias: "u",
        },
    },
    async run({ args }) {
        if (args.tables) {
            for (const schema of vingSchemas) {
                await makeTableFile({ schema });
            }
        }
        else if (args.up) {
            runMigrations();
        }
        else if (args.prepare) {
            exec("npx drizzle-kit generate:mysql --out ./ving/drizzle/migrations --schema ving/drizzle/schema", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(stdout);
            });
        }
    },
});