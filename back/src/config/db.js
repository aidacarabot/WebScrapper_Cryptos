const mongoose = require("mongoose");
require("dotenv").config(); // Asegúrate de cargar dotenv

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL; // Lee la URL desde el .env
    if (!dbUrl) {
      throw new Error("DB_URL no está definido en .env");
    }

    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 30000, // Espera hasta 30 segundos para conectarse
      socketTimeoutMS: 45000, // Tiempo máximo para operaciones largas
      bufferCommands: false, // Desactiva buffering
      autoIndex: false, // Mejora rendimiento evitando índices automáticos
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error Connecting to MongoDB:", error);
    process.exit(1); // Detener el proceso si hay un error
  }
};

module.exports = { connectDB };