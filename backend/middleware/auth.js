const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Token not provided" });
    }

    const bearer = token.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }

    const decodedToken = jwt.verify(bearer[1], process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.id = decodedToken.auth_user._id;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = authMiddleware;
