import express from "express";
import AuthController from "../controllers/AuthController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const authController = new AuthController();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post(
    "/login",
    authController.login.bind(authController)
);

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.get("/register", (req, res) => {
    res.render("register", {
        error: null,
        formData: {}
    });
});

router.post(
    "/register",
    authController.register.bind(authController)
);

router.get("/logged-in", requireAuth, (req, res) => {
    const flash = req.session.flash;
    delete req.session.flash;

    res.render("logged-in", {
        member: req.session.member,
        flash
    });
});

router.get("/search", requireAuth, (req, res) => {
    res.redirect("/books");
});

export default router;
