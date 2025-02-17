module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login"); // Redireciona para login se não estiver autenticado
    }
    next();
};
