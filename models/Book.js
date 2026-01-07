import db from "../config/db.js";

export default class Book {

    static async countFiltered({ categories, author, title }) {
        let sql = `SELECT COUNT(*) AS total FROM books`;
        const conditions = [];
        const params = [];

        if (categories.length > 0) {
            conditions.push(
                `(${categories.map(() => `category LIKE ?`).join(" OR ")})`
            );
            categories.forEach(cat => params.push(`%${cat}%`));
        }

        if (author) {
            conditions.push(`LOWER(author) LIKE ?`);
            params.push(`${author.toLowerCase()}%`);
        }

        if (title) {
            conditions.push(`LOWER(title) LIKE ?`);
            params.push(`%${title.toLowerCase()}%`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(" AND ");
        }

        const [[{ total }]] = await db.query(sql, params);
        return total;
    }

    static async findFiltered({ categories, author, title, limit, offset }) {
        let sql = `
            SELECT isbn AS id, title, author, price, category
            FROM books
        `;

        const conditions = [];
        const params = [];

        if (categories.length > 0) {
            conditions.push(
                `(${categories.map(() => `category LIKE ?`).join(" OR ")})`
            );
            categories.forEach(cat => params.push(`%${cat}%`));
        }

        if (author) {
            conditions.push(`LOWER(author) LIKE ?`);
            params.push(`${author.toLowerCase()}%`);
        }

        if (title) {
            conditions.push(`LOWER(title) LIKE ?`);
            params.push(`%${title.toLowerCase()}%`);
        }

        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(" AND ");
        }

        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);
        return rows;
    }
}
