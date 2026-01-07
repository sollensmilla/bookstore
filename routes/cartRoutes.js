import express from "express";
import { requireAuth } from "../middleware/auth.js";
import CartController from "../controllers/CartController.js";

const router = express.Router();
const controller = new CartController();

router.post("/cart/add", requireAuth, controller.add.bind(controller));
router.get("/cart", requireAuth, controller.view.bind(controller));
router.post("/cart/remove", requireAuth, controller.remove.bind(controller));

export default router;
