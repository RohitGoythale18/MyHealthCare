const roleCheck = async (req, res, next) => {
    const isAdmin = req.is_admin;
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized - Insufficient privileges" });
    }
    next();
}

module.exports = roleCheck;
