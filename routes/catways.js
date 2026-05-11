const express = require("express");
const router = express.Router();
const Catway = require("../models/catway");
const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("catways/list", { catways });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }
    res.render("catways/list", { catway });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.redirect("/catways");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }
    catway.catwayState = req.body.catwayState;
    await catway.save();
    res.redirect("/catways");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({
      catwayNumber: req.params.id,
    });
    if (!catway) {
      return res.status(404).json({ message: "Catway introuvable" });
    }
    res.redirect("/catways");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
