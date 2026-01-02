import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/search", (req, res) => {
    res.render("search");
});

export default router;
