import db from "../config/db.js";

export default class OrderDetail {

    static async create(orderNo, isbn, qty, price) {
        const amount = qty * price;

        await db.query(`
            INSERT INTO odetails (ono, isbn, qty, amount)
            VALUES (?, ?, ?, ?)
        `, [orderNo, isbn, qty, amount]);
    }
}
