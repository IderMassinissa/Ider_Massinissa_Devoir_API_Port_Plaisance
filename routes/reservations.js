const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get("/:id/reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    });
    res.render("reservations/list", {
      reservations,
      catwayNumber: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère une réservation en particulier
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *       404:
 *         description: Réservation introuvable
 */
router.get("/:id/reservations/:idReservation", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.render("reservations/form", { reservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.post("/:id/reservations", auth, async (req, res) => {
  try {
    const reservation = new Reservation({
      ...req.body,
      catwayNumber: req.params.id,
    });
    await reservation.save();
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Réservation modifiée
 *       404:
 *         description: Réservation introuvable
 */
router.put("/:id/reservations", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true },
    );
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation introuvable
 */
router.delete("/:id/reservations/:idReservation", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(
      req.params.idReservation,
    );
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.redirect(`/catways/${req.params.id}/reservations`);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
