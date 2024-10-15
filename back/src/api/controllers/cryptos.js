const Crypto = require("../models/cryptos");  // Para cargar el modelo de criptos
const cryptos = require("../../../cryptosData.json");  // Carga el archivo JSON con los datos

// Función para insertar múltiples criptomonedas en la base de datos
const insertManyCryptos = async (req, res, next) => {
  try {
    const batchSize = 1000; // Tamaño del lote: puedes ajustar este número según tu necesidad
    for (let i = 0; i < cryptos.length; i += batchSize) {
      const batch = cryptos.slice(i, i + batchSize);
      await Crypto.insertMany(batch); // Inserta el lote en la base de datos
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }
    return res.status(201).json("Todas las criptomonedas han sido subidas a la base de datos.");
  } catch (error) {
    console.error("Error al subir las criptomonedas:", error);
    return res.status(400).json(error);
  }
};

// Función para obtener todas las criptomonedas de la base de datos
const getAllCryptos = async (req, res, next) => {
  try {
    // Encuentra todas las criptomonedas en la base de datos
    const allCryptos = await Crypto.find();
    return res.status(200).json(allCryptos);  // Devuelve todas las criptos en la respuesta
  } catch (error) {
    console.error("Error al obtener las criptomonedas:", error);
    return res.status(400).json(error);  // Envía el error si algo falla
  }
};

module.exports = {
  insertManyCryptos,
  getAllCryptos
};
