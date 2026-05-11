const express = require("express");
const router = express.Router();
const Catway = require("../models/catway");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways
 */
router.get("/", auth, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("catways/list", { catways });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupère un catway par son numéro
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *       404:
 *         description: Catway introuvable
 */
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

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     responses:
 *       201:
 *         description: Catway créé
 */
router.post("/", auth, async (req, res) => {
  try {
    const catway = new Catway(req.body);
    await catway.save();
    res.redirect("/catways");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Modifie l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway modifié
 *       404:
 *         description: Catway introuvable
 */
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

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway introuvable
 */
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
