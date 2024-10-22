const { scrapper } = require("./scrapper");
const { connectDB } = require("../config/db");

const start = async () => {
  try {
    await connectDB(); // Asegura la conexión con MongoDB
    console.log("MongoDB conectado. Iniciando scrapper...");
    await scrapper("https://finance.yahoo.com/markets/crypto/all/");
  } catch (error) {
    console.error("Error:", error);
  }
};

start();