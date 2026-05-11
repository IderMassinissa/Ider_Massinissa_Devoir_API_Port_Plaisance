const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Reservation = require("../models/reservation");
const auth = require("../middlewares/auth");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .render("index", { error: "Email ou mot de passe incorrect" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .render("index", { error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).render("index", { error: "Erreur serveur" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/dashboard", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    const reservations = await Reservation.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.render("dashboard", { user, reservations });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
