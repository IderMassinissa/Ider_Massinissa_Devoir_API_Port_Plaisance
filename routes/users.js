const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.render("users/list", { users });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupère un utilisateur par son email
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/:email", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.render("users/form", { user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post("/", auth, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect("/users");
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *       404:
 *         description: Utilisateur introuvable
 */
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

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */
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
