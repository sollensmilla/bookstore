import Book from "../models/Book.js";
import Cart from "../models/Cart.js";

export default class BookController {

    async search(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        
        const userid = req.session.member.id;

        const cartCount = await Cart.countItems(userid);

        const categories = [].concat(req.query.category || []);
        const author = req.query.author?.trim();
        const title = req.query.title?.trim();

        const queryParams = [];
        queryParams.push(`limit=${limit}`);

        categories.forEach(cat => {
            queryParams.push(`category=${encodeURIComponent(cat)}`);
        });
        if (author) queryParams.push(`author=${encodeURIComponent(author)}`);
        if (title) queryParams.push(`title=${encodeURIComponent(title)}`);

        const queryString = queryParams.join("&");

        try {
            const total = await Book.countFiltered({ categories, author, title });
            const totalPages = Math.ceil(total / limit);

            const books = await Book.findFiltered({
                categories,
                author,
                title,
                limit,
                offset
            });

            if (total === 0) {
                req.session.flash = {
                    type: "error",
                    message: "No books found for this category."
                };
            }

            res.render("search", {
                member: req.session.member,
                books,
                cartCount,
                page,
                limit,
                totalPages,
                selectedCategories: categories,
                author,
                title,
                queryString,
                flash: req.session.flash
            });

            req.session.flash = null;

        } catch (err) {
            console.error(err);
            res.status(500).send("Database error");
        }
    }
}
