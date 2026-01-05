import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/books", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    let sql = `
        SELECT id, title, author, price, category
        FROM books
        LIMIT ? OFFSET ?
    `;

    const [books] = await db.query(sql, [limit, offset]);

    res.render("books", {
        member: req.session.member,
        books,
        page
    });
});

export default router;
