require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const cryptosRouter = require("./src/api/routes/cryptos");
const cors = require("cors");

const app = express();
 app.use(express.json());  // Middleware para parsear JSON

connectDB();

app.use(cors());

app.use("/api/v1/cryptos", cryptosRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found")
});

module.exports = app;  // Exporta la aplicación

