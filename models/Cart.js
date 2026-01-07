import db from "../config/db.js";

export default class Cart {

    static async add(userid, isbn) {
        await db.query(
            `
            INSERT INTO cart (userid, isbn, qty)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE qty = qty + 1
            `,
            [userid, isbn]
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
}
