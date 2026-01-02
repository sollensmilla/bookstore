import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "NodeMySQL123!",
    database: "book_store"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

export default db;
