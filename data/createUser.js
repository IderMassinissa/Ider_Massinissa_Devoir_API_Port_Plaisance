require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await User.create({
      username: "admin",
      email: "admin@port-russell.fr",
      password: "admin123",
    });
    console.log("Utilisateur créé avec succès");
    process.exit();
  })
  .catch((err) => {
    console.error("Erreur :", err);
    process.exit(1);
  });
