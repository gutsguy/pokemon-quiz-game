const jwt = require("jsonwebtoken");

module.exports = {
  createToken: user => {
    return jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  },
  verifyToken: token => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};
