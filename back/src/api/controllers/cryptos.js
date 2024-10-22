const fs = require('fs');
const path = require('path');
const Crypto = require("../models/cryptos");

// Función para insertar o actualizar múltiples criptomonedas usando upsert
const insertManyCryptos = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../../cryptosData.json'); // Ruta al JSON

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json("El archivo JSON no se encontró.");
    }

    // Leer y parsear los datos del archivo JSON
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Iterar sobre cada cripto y usar upsert para insertar o actualizar
    for (const crypto of data) {
      await Crypto.updateOne(
        { shortName: crypto.shortName }, // Busca por shortName (clave única)
        { $set: crypto }, // Actualiza con los nuevos valores
        { upsert: true } // Si no existe, inserta
      );
      console.log(`Procesada: ${crypto.shortName}`);
    }

    return res.status(201).json("Todas las criptomonedas han sido subidas o actualizadas.");
  } catch (error) {
    console.error("Error al subir las criptomonedas:", error);
    return res.status(500).json({ error: error.message });
  }
};


const getAllCryptos = async (req, res) => {
  try {
    const allCryptos = await Crypto.find();
    return res.status(200).json(allCryptos);
  } catch (error) {
    console.error("Error al obtener las criptomonedas:", error);
    return res.status(500).json(error);
  }
};

module.exports = { insertManyCryptos, getAllCryptos };