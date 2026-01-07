import Cart from "../models/Cart.js";

export default class CartController {

    async add(req, res) {
        const userid = req.session.member.id;
        const { isbn, quantity } = req.body;

        const qty = parseInt(quantity) || 1;

        try {
            await Cart.add(userid, isbn, qty);

            req.session.flash = {
                type: "success",
                message: `${qty} book(s) added to cart`
            };

            res.redirect("/search");
        } catch (err) {
            console.error(err);
            res.status(500).send("Database error");
        }
    }

    async view(req, res) {
        const userid = req.session.member.id;

        try {
            const items = await Cart.getItems(userid);
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
    }

    async remove(req, res) {
        const userid = req.session.member.id;
        const { isbn } = req.body;

        await Cart.remove(userid, isbn);
        res.redirect("/cart");
    }
}
