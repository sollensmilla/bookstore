import db from "../config/db.js";

export default class Member {
    constructor({
        fname,
        lname,
        address,
        city,
        zip,
        phone,
        email,
        password
    }) {
        this.fname = fname;
        this.lname = lname;
        this.address = address;
        this.city = city;
        this.zip = zip;
        this.phone = phone;
        this.email = email;
        this.password = password;
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM members WHERE email = ?";
            db.query(sql, [email], (err, result) => {
                if (err) return reject(err);
                resolve(result[0] || null);
            });
        });
    }

    save() {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO members
                (fname, lname, address, city, zip, phone, email, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                this.fname,
                this.lname,
                this.address,
                this.city,
                this.zip,
                this.phone,
                this.email,
                this.password
            ];

            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                this.id = result.insertId;
                resolve(this);
            });
        });
    }
}