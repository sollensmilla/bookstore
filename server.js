import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

const app = express();
const PORT = 3017;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

try {
    const conn = await db.getConnection();
    console.log("Database connected");
    conn.release();
} catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
}

import session from "express-session";

app.use(session({
    name: "session-id",
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.flash = req.session.flash || null;
    res.locals.books = [];
    res.locals.selectedCategories = [];
    res.locals.page = 1;
    next();
});

app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    req.session.flash = null;
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

import authRoutes from "./routes/authRoutes.js";
app.use("/", authRoutes);

import booksRoutes from "./routes/bookRoutes.js";
app.use("/", booksRoutes);

import cartRoutes from "./routes/cartRoutes.js";
app.use("/", cartRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
