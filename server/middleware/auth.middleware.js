const jwtService = require("../services/auth/jwt.service");

const authMiddleware = (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  const authCookie = req?.cookies?.Authorization;

  const token = authHeader || authCookie;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }

  next();
};

module.exports = authMiddleware;
