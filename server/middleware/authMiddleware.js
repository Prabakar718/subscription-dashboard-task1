const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(auth.split(" ")[1], process.env.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(401).json({ message });
  }
};

module.exports = protect;
