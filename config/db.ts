import knex from "knex";

export const client = knex({
    client: 'cockroachdb',
    connection: process.env.CONNECTION_URI,
})

