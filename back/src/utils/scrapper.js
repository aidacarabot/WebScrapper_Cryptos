const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Crypto = require("../api/models/cryptos");

const dataPath = "cryptosData.json";
const progressFile = "progress.json";

let batchNumber = 0; // Declaramos el contador de lotes a nivel global

// Cargar progreso guardado
const loadProgress = () => {
  if (fs.existsSync(progressFile)) {
    const data = JSON.parse(fs.readFileSync(progressFile, "utf8"));
    return data.lastPage || 1;
  }
  return 1;
};

// Guardar progreso actual
const saveProgress = (pageNum) => {
  fs.writeFileSync(progressFile, JSON.stringify({ lastPage: pageNum }, null, 2));
};

// Cargar datos existentes del JSON
const loadExistingData = () => {
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return Array.isArray(data) ? data : [];
  }
  return [];
};

// Actualizar el JSON sin duplicados
const updateJsonFile = (newData) => {
  const existingData = loadExistingData();
  const dataMap = new Map(existingData.map((crypto) => [crypto.shortName, crypto]));
  newData.forEach((crypto) => dataMap.set(crypto.shortName, crypto));
  const updatedData = Array.from(dataMap.values());
  fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
};

// Retardo entre lotes
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Subir los datos a MongoDB en lotes
const saveToMongoDB = async (data) => {
  const batchSize = 100;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const operations = batch.map((crypto) => ({
      updateOne: {
        filter: { shortName: crypto.shortName },
        update: { $set: crypto },
        upsert: true,
      },
    }));

    try {
      await Crypto.bulkWrite(operations, { ordered: false, maxTimeMS: 60000 });
      batchNumber++; // Incrementamos el número del lote globalmente
      console.log(`Lote ${batchNumber} guardado en MongoDB.`);
      await delay(500); // Retardo entre lotes
    } catch (error) {
      console.error(`Error guardando lote ${batchNumber}:`, error);
    }
  }
};

// Scraping de una página
const scrapePage = async (page) => {
  return await page.evaluate(() => {
    const cryptos = [];
    const rows = document.querySelectorAll("tr.yf-1dbt8wv.row");

    rows.forEach((row) => {
      const img = row.querySelector("img.yf-138ga19.logo.stacked")?.src || "";
      const shortName = row.querySelector("span.symbol.yf-138ga19")?.textContent.trim() || "";
      const longName = row.querySelector("span.yf-138ga19.longName")?.textContent.trim() || "";
      const price = row.querySelector('fin-streamer[data-field="regularMarketPrice"]')?.textContent.trim() || "";

      if (img && shortName && longName && price) {
        cryptos.push({ shortName, img, longName, price });
      }
    });

    return cryptos;
  });
};

// Ir a la siguiente página
const goToNextPage = async (page) => {
  try {
    const nextButton = await page.$$("button.icon-btn");
    if (nextButton && nextButton.length > 2) {
      await nextButton[2].click();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al intentar pasar a la siguiente página:", error);
    return false;
  }
};

// Función principal del scraper
const scrapper = async (url, totalPages = 9956) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let currentPage = loadProgress();

  console.log(`Reanudando scraping desde la página ${currentPage}`);
  await page.goto(url, { waitUntil: "networkidle2" });

  while (currentPage <= totalPages) {
    try {
      console.log(`Scraping página: ${currentPage}`);
      const pageData = await scrapePage(page);
      updateJsonFile(pageData); // Actualizar JSON sin duplicados
      await saveToMongoDB(pageData); // Subir a MongoDB
      saveProgress(currentPage); // Guardar progreso
      const hasNextPage = await goToNextPage(page); // Ir a la siguiente página
      if (!hasNextPage) break;
      currentPage++;
    } catch (error) {
      console.error(`Error en la página ${currentPage}:`, error);
      break;
    }
  }

  await browser.close();
  console.log("Scraping completado.");
};

module.exports = { scrapper };