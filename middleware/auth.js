export function requireAuth(req, res, next) {
    if (!req.session.member) {
        return res.redirect("/login");
    }
    next();
}
