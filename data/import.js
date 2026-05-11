require("dotenv").config();
const mongoose = require("mongoose");
const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const catways = require("./catways.json");
const reservations = require("./reservations.json");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Catway.insertMany(catways);
    await Reservation.insertMany(reservations);
    console.log("Données importées avec succès");
    process.exit();
  })
  .catch((err) => {
    console.error("Erreur :", err);
    process.exit(1);
  });
