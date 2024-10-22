const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
 shortName: { type: String, required: true, unique: true }, // Índice único
  longName: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: String, required: true },
},
{
  timestamps: true,
  collection: "cryptos",
}
);

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
