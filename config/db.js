import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NodeMySQL123!",
    database: "book_store",
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;
