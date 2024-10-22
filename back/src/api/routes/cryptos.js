const { insertManyCryptos, getAllCryptos } = require("../controllers/cryptos");

const cryptosRouter = require("express").Router();

cryptosRouter.post("/save", insertManyCryptos); // Asegúrate de que esta función esté bien definida
cryptosRouter.get("/get", getAllCryptos); // Lo mismo para esta función

module.exports = cryptosRouter;