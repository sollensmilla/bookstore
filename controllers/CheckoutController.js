import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import db from "../config/db.js";
import Cart from "../models/Cart.js";

export default class CheckoutController {

    async checkout(req, res) {
        try {
            const user = req.session.member;

            const cart = await this.#getCart(user.id);
            if (this.#cartIsEmpty(cart)) {
                return res.redirect("/cart");
            }

            const member = await this.#getMember(user.id);
            const orderNo = await this.#createOrder(user.id, member);

            await this.#createOrderDetails(orderNo, cart);
            await this.#clearCart(user.id);

            const orderSummary = this.#buildOrderSummary(orderNo, cart, member);
            this.#storeOrderInSession(req, orderSummary);

            res.redirect("/checkout/invoice");

        } catch (err) {
            console.error(err);
            res.send("Checkout failed");
        }
    }

    // ===== Private helper methods =====

    async #getCart(userId) {
        return Cart.getItems(userId);
    }

    #cartIsEmpty(cart) {
        return !cart || cart.length === 0;
    }

    async #getMember(userId) {
        const [rows] = await db.query(`
            SELECT fname, lname, address, city, zip
            FROM members WHERE userid = ?
        `, [userId]);

        return rows[0];
    }

    async #createOrder(userId, member) {
        return Order.create({
            userId,
            address: member.address,
            city: member.city,
            zip: member.zip
        });
    }

    async #createOrderDetails(orderNo, cart) {
        for (const item of cart) {
            await OrderDetail.create(
                orderNo,
                item.isbn,
                item.qty,
                item.price
            );
        }
    }

    async #clearCart(userId) {
        await Cart.clear(userId);
    }

    #buildOrderSummary(orderNo, cart, member) {
        const orderDate = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(orderDate.getDate() + 7);

        const total = cart.reduce(
            (sum, item) => sum + item.total,
            0
        );

        return {
            orderNo,
            cart,
            total,
            orderDate,
            deliveryDate,
            member
        };
    }

    #storeOrderInSession(req, orderSummary) {
        req.session.lastOrder = orderSummary;
        req.session.cart = [];
    }
}