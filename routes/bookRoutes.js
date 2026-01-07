import express from "express";
import { requireAuth } from "../middleware/auth.js";
import BookController from "../controllers/BookController.js";

const router = express.Router();
const controller = new BookController();

router.get("/books", requireAuth, controller.search.bind(controller));

export default router;
