import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import Database from "better-sqlite3";

const db = new Database(":memory:");

export const auth = betterAuth({
    baseURL: "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
    },
    database: db,
    plugins: [
        apiKey()
    ]
});

const { runMigrations } = await getMigrations(auth.options);
await runMigrations();