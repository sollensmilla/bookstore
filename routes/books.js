import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        // Kategorier från query (checkboxar)
        const categories = [].concat(req.query.category || []);

        // --- 1. Hämta totalt antal böcker med filter ---
        let countSql = `SELECT COUNT(*) AS total FROM books`;
        const countParams = [];

        if (categories.length > 0) {
            const conditions = categories.map(() => `category LIKE ?`).join(" OR ");
            countSql += ` WHERE (${conditions})`;
            categories.forEach(cat => countParams.push(`%${cat}%`));
        }

        const [countResult] = await db.query(countSql, countParams);
        const totalBooks = countResult[0].total;
        const totalPages = Math.ceil(totalBooks / limit);

        // --- 2. Hämta böcker med LIMIT och OFFSET ---
        let sql = `SELECT isbn AS id, title, author, price, category FROM books`;
        const params = [];

        if (categories.length > 0) {
            const conditions = categories.map(() => `category LIKE ?`).join(" OR ");
            sql += ` WHERE (${conditions})`;
            categories.forEach(cat => params.push(`%${cat}%`));
        }

        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [books] = await db.query(sql, params);

        // Flash om inga böcker
        if (books.length === 0 && categories.length > 0) {
            req.session.flash = {
                type: "error",
                message: "No books found for selected category"
            };
        }

        // --- 3. Rendera sidan ---
        res.render("search", {
            member: req.session.member,
            books,
            page,
            totalPages,
            selectedCategories: categories,
            flash: req.session.flash
        });

        req.session.flash = null;

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;