import express from "express";
import db from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   ADD TO CART
============================ */
router.post("/cart/add", requireAuth, async (req, res) => {
    const userid = req.session.member.id;
    const { isbn } = req.body;

    try {
        await db.query(
            `
            INSERT INTO cart (userid, isbn, qty)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE qty = qty + 1
            `,
            [userid, isbn]
        );

        req.session.flash = {
            type: "success",
            message: "Book added to cart"
        };

        res.redirect("/search");
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

/* ============================
   VIEW CART
============================ */
router.get("/cart", requireAuth, async (req, res) => {
    const userid = req.session.member.id;

    try {
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

        const totalSum = items.reduce((sum, i) => sum + i.total, 0);

        res.render("cart", {
            member: req.session.member,
            items,
            totalSum,
            flash: req.session.flash
        });

        req.session.flash = null;

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

/* ============================
   REMOVE FROM CART
============================ */
router.post("/cart/remove", requireAuth, async (req, res) => {
    const userid = req.session.member.id;
    const { isbn } = req.body;

    await db.query(
        `DELETE FROM cart WHERE userid = ? AND isbn = ?`,
        [userid, isbn]
    );

    res.redirect("/cart");
});

export default router;
