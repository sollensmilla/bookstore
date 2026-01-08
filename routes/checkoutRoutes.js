import express from "express";
import CheckoutController from "../controllers/CheckoutController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const controller = new CheckoutController();

router.post("/", requireAuth, controller.checkout.bind(controller));

router.get("/invoice", requireAuth, (req, res) => {
    const order = req.session.lastOrder;
    if (!order) return res.redirect("/cart");

    order.orderDate = new Date(order.orderDate);
    order.deliveryDate = new Date(order.deliveryDate);

    res.render("invoice", order);
});


export default router;
