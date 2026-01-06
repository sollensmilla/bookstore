import express from "express";
import db from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/books", requireAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const categories = [].concat(req.query.category || []);
    const author = req.query.author?.trim();
    const title = req.query.title?.trim();

    const queryParams = [];
    queryParams.push(`limit=${limit}`);

    categories.forEach(cat => {
        queryParams.push(`category=${encodeURIComponent(cat)}`);
    });

    if (author) {
        queryParams.push(`author=${encodeURIComponent(author)}`);
    }

    if (title) {
        queryParams.push(`title=${encodeURIComponent(title)}`);
    }

    const queryString = queryParams.join("&");

    try {
        /* ============================
           1. COUNT – hur många böcker totalt?
        ============================ */
        let countSql = `SELECT COUNT(*) AS total FROM books`;
        const countConditions = [];
        const countParams = [];

        if (categories.length > 0) {
            const conditions = categories.map(() => `category LIKE ?`).join(" OR ");
            countSql += ` WHERE (${conditions})`;
            categories.forEach(cat => countParams.push(`%${cat}%`));
        }

        if (author) {
            countConditions.push(`LOWER(author) LIKE ?`);
            countParams.push(`${author.toLowerCase()}%`);
        }

        if (title) {
            countConditions.push(`LOWER(title) LIKE ?`);
            countParams.push(`%${title.toLowerCase()}%`);
        }

        if (countConditions.length > 0) {
            countSql += ` WHERE ` + countConditions.join(" AND ");
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
            author,
            title,
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
