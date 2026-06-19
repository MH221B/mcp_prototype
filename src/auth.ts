import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database(":memory:", { verbose: console.log });

export const auth = betterAuth({
    database: db,
    plugins: [
        apiKey()
    ]
});