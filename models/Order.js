import db from "../config/db.js";

export default class Order {

    static async create({ userId, address, city, zip }) {
        const [result] = await db.query(`
            INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip)
            VALUES (?, NOW(), ?, ?, ?)
        `, [userId, address, city, zip]);

        return result.insertId;
    }
}
