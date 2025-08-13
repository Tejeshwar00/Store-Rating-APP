const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");              // mysql pool/connection
const UserModel = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, password required" });

    // duplicate email?
    db.query(UserModel.findByEmail, [email], async (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error", detail: err.sqlMessage });
      if (rows.length) return res.status(409).json({ message: "Email already registered" });

      const hash = await bcrypt.hash(password, 10);
      db.query(
        UserModel.createUser,
        [name, email, hash, address || "", role || "NORMAL_USER"],
        (err2) => {
          if (err2) return res.status(500).json({ message: "Insert failed", detail: err2.sqlMessage });
          return res.status(201).json({ message: "Registered successfully" });
        }
      );
    });
  } catch (e) {
    return res.status(500).json({ message: "Unexpected error" });
  }
});

module.exports = router;
