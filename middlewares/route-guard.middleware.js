const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);

    req.tokenPayload = payload;
    next();
  } catch (error) {
    res.status(401).json("token not valid");
  }
};

module.exports = { isAuthenticated };
