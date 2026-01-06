import express from "express";
import db from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/books", requireAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const categories = [].concat(req.query.category || []);

    const queryParams = [];

    queryParams.push(`limit=${limit}`);

    categories.forEach(cat => {
        queryParams.push(`category=${encodeURIComponent(cat)}`);
    });

    const queryString = queryParams.join("&");

    try {
        /* ============================
           1. COUNT – hur många böcker totalt?
        ============================ */
        let countSql = `SELECT COUNT(*) AS total FROM books`;
        const countParams = [];

        if (categories.length > 0) {
            const conditions = categories.map(() => `category LIKE ?`).join(" OR ");
            countSql += ` WHERE (${conditions})`;
            categories.forEach(cat => countParams.push(`%${cat}%`));
        }

        const [[{ total }]] = await db.query(countSql, countParams);
        const totalPages = Math.ceil(total / limit);

        /* ============================
           2. Hämta bara rätt sida
        ============================ */
        let sql = `
            SELECT isbn AS id, title, author, price, category
            FROM books
        `;

        const params = [];

        if (categories.length > 0) {
            const conditions = categories.map(() => `category LIKE ?`).join(" OR ");
            sql += ` WHERE (${conditions})`;
            categories.forEach(cat => params.push(`%${cat}%`));
        }

        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [books] = await db.query(sql, params);

        /* ============================
           3. Flash-meddelande om tomt
        ============================ */
        if (total === 0) {
            req.session.flash = {
                type: "error",
                message: "No books found for this category."
            };
        }

        /* ============================
           4. Render
        ============================ */
        res.render("search", {
            member: req.session.member,
            books,
            page,
            limit,
            totalPages,
            selectedCategories: categories,
            queryString,
            flash: req.session.flash
        });

        req.session.flash = null;

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

export default router;
