import dotenv from "dotenv";
import { Client } from 'pg';
dotenv.config();

const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DBNAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
})

export const connectDb =  (): any => {
    return client.connect();
};

export const getNotionDbId = (dbName: string): any => {
    return client.query('select id, db_id, name from dbList where name=$1', [dbName])
        .then(result => {
            if (result.rows && result.rows.length) {
                return result.rows[0].db_id;
            } else {
                throw 'not found';
            }
        });
}
