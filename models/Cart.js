import db from "../config/db.js";

export default class Cart {

    static async add(userid, isbn, qty = 1) {
        await db.query(
            `
            INSERT INTO cart (userid, isbn, qty)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE qty = qty + ?
            `,
            [userid, isbn, qty, qty]
        );
    }

    static async getItems(userid) {
        const [items] = await db.query(
            `
            SELECT 
                b.isbn,
                b.title,
                b.price,
                c.qty,
                (b.price * c.qty) AS total
            FROM cart c
            JOIN books b ON c.isbn = b.isbn
            WHERE c.userid = ?
            `,
            [userid]
        );

        return items;
    }

    static async remove(userid, isbn) {
        await db.query(
            `DELETE FROM cart WHERE userid = ? AND isbn = ?`,
            [userid, isbn]
        );
    }

    static async countItems(userid) {
        const [rows] = await db.query(
            `SELECT SUM(qty) AS total FROM cart WHERE userid = ?`,
            [userid]
        );
        return rows[0].total || 0;
    }
}
