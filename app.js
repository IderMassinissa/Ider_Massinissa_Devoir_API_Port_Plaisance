require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");
const userRoutes = require("./routes/users");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

app.use("/", authRoutes);
app.use("/catways", catwayRoutes);
app.use("/catways", reservationRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
