const { insertManyCryptos, getAllCryptos } = require("../controllers/cryptos");

const cryptosRouter = require("express").Router();

cryptosRouter.post("/save", insertManyCryptos);
cryptosRouter.get("/get", getAllCryptos);

module.exports = cryptosRouter;