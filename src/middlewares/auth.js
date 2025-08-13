const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @desc Authenticate user by verifying JWT
 */
function authenticate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // { id, role }
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
}

/**
 * @desc Authorize specific roles
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

module.exports = { authenticate, authorizeRoles };
