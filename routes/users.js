const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { users });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:email", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.render("users/list", { user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect("/users");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:email", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.redirect("/users");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:email", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.redirect("/users");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
