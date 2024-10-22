const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Crypto = require("../api/models/cryptos");

const dataPath = "cryptosData.json";
const progressFile = "progress.json";

// Cargar progreso desde `progress.json` (página y lote)
const loadProgress = () => {
  if (fs.existsSync(progressFile)) {
    const data = JSON.parse(fs.readFileSync(progressFile, "utf8"));
    return {
      lastPage: data.lastPage || 1,
      lastBatch: data.lastBatch || 0,
    };
  }
  return { lastPage: 1, lastBatch: 0 };
};

// Guardar progreso en `progress.json` (página y lote)
const saveProgress = (pageNum, batchNum) => {
  const data = {
    lastPage: pageNum,
    lastBatch: batchNum,
  };
  fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
};

// Obtener el último lote guardado en MongoDB
const getLastBatchNumberFromDB = async () => {
  const lastCrypto = await Crypto.findOne().sort({ batchNumber: -1 }).exec();
  return lastCrypto?.batchNumber || 0;
};

// Guardar criptomonedas en MongoDB sin duplicados
const saveToMongoDB = async (data, batchNumber) => {
  const batchSize = 100;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map((crypto) => ({
      ...crypto,
      batchNumber, // Asignar el número del lote al documento
    }));

    try {
      const operations = batch.map((crypto) => ({
        updateOne: {
          filter: { shortName: crypto.shortName },
          update: { $set: crypto },
          upsert: true,
        },
      }));

      await Crypto.bulkWrite(operations, { ordered: false, maxTimeMS: 60000 });
      console.log(`Lote ${batchNumber} guardado en MongoDB.`);
      batchNumber++; // Incrementar el número del lote
    } catch (error) {
      console.error(`Error guardando lote ${batchNumber}:`, error);
    }
  }
  return batchNumber; // Devolver el último número de lote usado
};

// Scraping de una página específica
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

  const progress = loadProgress(); // Cargar progreso desde progress.json
  let { lastPage, lastBatch } = progress;

  console.log(`Reanudando scraping desde la página ${lastPage} y lote ${lastBatch}`);
  
  const lastBatchInDB = await getLastBatchNumberFromDB(); // Obtener último lote en MongoDB
  let batchNumber = Math.max(lastBatch, lastBatchInDB + 1); // Elegir el mayor entre ambos

  await page.goto(url, { waitUntil: "networkidle2" });

  while (lastPage <= totalPages) {
    try {
      console.log(`Scraping página: ${lastPage}`);
      const pageData = await scrapePage(page);
      batchNumber = await saveToMongoDB(pageData, batchNumber); // Guardar y actualizar lote
      saveProgress(lastPage, batchNumber); // Guardar progreso
      const hasNextPage = await goToNextPage(page); // Ir a la siguiente página
      if (!hasNextPage) break;
      lastPage++;
    } catch (error) {
      console.error(`Error en la página ${lastPage}:`, error);
      break;
    }
  }

  await browser.close();
  console.log("Scraping completado.");
};

module.exports = { scrapper };