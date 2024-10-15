const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Conectar a MongoDB sin opciones obsoletas
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 30000 // 30 segundos de espera antes de que se agote el tiempo
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error Connecting to MongoDB:", error);
  }
};

module.exports = { connectDB };
