import knex from "knex";
import { translateDbError } from "./errors";

export const db = knex({
    client: "pg",
    connection: process.env.DATABASE_URL
});

export async function executeQuery<T>(
    operation: string,
    queryFn: () => Promise<T>
): Promise<T> {
    try {
        return await queryFn();
    } catch (error: any) {
        console.error(`Database Error [${operation}]:`, {
            message: error.message,
            code: error.code,
            detail: error.detail
        });

        throw translateDbError(error);
    }
}