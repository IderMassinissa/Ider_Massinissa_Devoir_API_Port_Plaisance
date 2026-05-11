const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const auth = require("../middlewares/auth");

router.get("/:id/reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    });
    res.render("reservations/list", { reservations });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id/reservations/:idReservation", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }
    res.render("reservations/list", { reservation });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

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
