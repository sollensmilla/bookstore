import mysql from "mysql2/promise";

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NodeMySQL123!",
    database: "book_store"
});

console.log("Connected to MySQL");

export default db;
