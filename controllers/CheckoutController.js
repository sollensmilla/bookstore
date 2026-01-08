import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import db from "../config/db.js";
import Cart from "../models/Cart.js";

export default class CheckoutController {
    async checkout(req, res) {
        try {
            const user = req.session.member;

            const cart = await Cart.getItems(user.id);

            if (!cart || cart.length === 0) {
                return res.redirect("/cart");
            }

            const [rows] = await db.query(`
                SELECT fname, lname, address, city, zip
                FROM members WHERE userid = ?
            `, [user.id]);
            const member = rows[0];

            const orderNo = await Order.create({
                userId: user.id,
                address: member.address,
                city: member.city,
                zip: member.zip
            });

            for (const item of cart) {
                await OrderDetail.create(
                    orderNo,
                    item.isbn,
                    item.qty,
                    item.price
                );
            }

            await Cart.clear(user.id);

            const orderDate = new Date();
            const deliveryDate = new Date();
            deliveryDate.setDate(orderDate.getDate() + 7);

            const total = cart.reduce((sum, item) => sum + item.total, 0);

            req.session.lastOrder = { orderNo, cart, total, orderDate, deliveryDate, member };
            req.session.cart = [];

            res.redirect("/checkout/invoice");

        } catch (err) {
            console.error(err);
            res.send("Checkout failed");
        }
    }
}
