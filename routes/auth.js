import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();
const authController = new AuthController();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post(
    "/register",
    authController.register.bind(authController)
);

import { requireAuth } from "../middleware/auth.js";

router.get("/logged-in", requireAuth, (req, res) => {
    const success = req.session.success;
    delete req.session.success;

    res.render("logged-in", {
        member: req.session.member,
        success
    });
});

router.get("/search", (req, res) => {
    res.render("search");
});

export default router;
