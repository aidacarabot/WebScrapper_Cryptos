const { insertManyCryptos, getAllCryptos, getCryptoByName } = require("../controllers/cryptos");

const cryptosRouter = require("express").Router();

cryptosRouter.post("/save", insertManyCryptos); // Asegúrate de que esta función esté bien definida
cryptosRouter.get("/get", getAllCryptos); // Lo mismo para esta función
cryptosRouter.get("/search", getCryptoByName);// Ruta para buscar una cripto por nombre

module.exports = cryptosRouter;