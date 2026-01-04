import db from "../config/db.js";

export default class Member {
    constructor({
        firstName,
        lastName,
        address,
        city,
        zip,
        phone,
        email,
        password
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
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
                this.firstName,
                this.lastName,
                this.address,
                this.city,
                this.zip,
                this.phone,
                this.email,
                this.password
            ];

            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}