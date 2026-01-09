import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: "book_store",
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;
