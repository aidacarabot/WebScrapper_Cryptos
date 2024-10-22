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

// Obtener criptomonedas aleatorias con paginación
const getAllCryptos = async (req, res) => {
  try {
    const { limit = 100 } = req.query; // Valor por defecto: 100 resultados por página

    // Selección aleatoria de criptomonedas con límite
    const cryptos = await Crypto.aggregate([
      { $sample: { size: Number(limit) } }
    ]);

    const total = await Crypto.countDocuments(); // Total de documentos en la colección

    res.status(200).json({
      total,
      limit: Number(limit),
      data: cryptos,
    });
  } catch (error) {
    console.error("Error al obtener las criptomonedas:", error);
    res.status(500).json({ message: "Error al obtener las criptomonedas." });
  }
};

// Buscar una criptomoneda por nombre (coincidencia parcial)
const getCryptoByName = async (req, res) => {
  try {
    const { name } = req.query; // Obtenemos el parámetro 'name' del query

    if (!name) {
      return res.status(400).json({ message: "Debes proporcionar un nombre para buscar." });
    }

    // Usamos una expresión regular para buscar coincidencias parciales (case-insensitive)
    const regex = new RegExp(name, "i"); 

    // Buscar criptos cuyo 'shortName' o 'longName' coincidan parcialmente
    const cryptos = await Crypto.find({
      $or: [{ shortName: regex }, { longName: regex }]
    });

    if (cryptos.length === 0) {
      return res.status(404).json({ message: "No se encontraron criptomonedas con ese nombre." });
    }

    res.status(200).json(cryptos);
  } catch (error) {
    console.error("Error al buscar la criptomoneda:", error);
    res.status(500).json({ message: "Error al buscar la criptomoneda." });
  }
};


module.exports = { insertManyCryptos, getAllCryptos, getCryptoByName };