import db from "../config/db.js";

export default class Member {
    constructor({
        id,
        fname,
        lname,
        address,
        city,
        zip,
        phone,
        email,
        password
    }) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.address = address;
        this.city = city;
        this.zip = zip;
        this.phone = phone;
        this.email = email;
        this.password = password;
    }

    static async findByEmail(email) {
        const [rows] = await db.query(
            "SELECT * FROM members WHERE email = ?",
            [email]
        );

        if (rows.length === 0) return null;

        return new Member(rows[0]);
    }

    async save() {
        const [result] = await db.query(
            `
            INSERT INTO members
            (fname, lname, address, city, zip, phone, email, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                this.fname,
                this.lname,
                this.address,
                this.city,
                this.zip,
                this.phone,
                this.email,
                this.password
            ]
        );

        this.id = result.insertId;
        return this;
    }
}
