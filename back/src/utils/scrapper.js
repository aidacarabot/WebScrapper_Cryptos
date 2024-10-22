const puppeteer = require("puppeteer");
const fs = require("fs");
const path = "cryptosData.json"; // Ruta al archivo JSON

// Elimina el archivo JSON si ya existe, para evitar datos duplicados o viejos
const deleteExistingFile = () => {
  if (fs.existsSync(path)) {
    console.log("Archivo existente encontrado. Eliminando...");
    fs.unlinkSync(path); // Elimina el archivo JSON existente
  }
};

// Función para scrapear los datos de una sola página
const scrapePage = async (page) => {
  return await page.evaluate(() => {
    const cryptos = [];

    // Seleccionamos todas las filas de criptomonedas por su clase
    const rows = document.querySelectorAll('tr.yf-1dbt8wv.row');

    // Iteramos sobre las filas seleccionadas
    rows.forEach((row) => {
      const img = row.querySelector('img.yf-138ga19.logo.stacked')?.src || '';
      const shortName = row.querySelector('span.symbol.yf-138ga19')?.textContent.trim() || '';
      const longName = row.querySelector('span.yf-138ga19.longName')?.textContent.trim() || '';
      const price = row.querySelector('fin-streamer[data-field="regularMarketPrice"]')?.textContent.trim() || '';

      console.log({ img, shortName, longName, price });

      // Verificamos que todos los campos tengan valor antes de añadirlos
      if (img && shortName && longName && price) {
        const crypto = { shortName, img, longName, price };
        cryptos.push(crypto);
      }
    });

    return cryptos;
  });
};

// Función para pasar a la siguiente página
const goToNextPage = async (page) => {
  try {
    const nextButton = await page.$$('button.icon-btn');
    if (nextButton && nextButton.length > 2) {
      await nextButton[2].click(); // Clic en el tercer botón "icon-btn"
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Esperamos 3 segundos
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al intentar pasar a la siguiente página:", error);
    return false;
  }
};

// Función para inicializar el archivo JSON con el corchete de apertura
const initializeFile = () => {
  fs.writeFileSync(path, '[', 'utf8'); // Abrimos el array
};

// Función para escribir los datos en el archivo JSON sin duplicar corchetes
const writeDataToFile = (data, isFirstPage) => {
  const content = JSON.stringify(data, null, 2).slice(1, -1); // Quitamos los corchetes externos del JSON
  const prefix = isFirstPage ? '' : ','; // Añadimos una coma solo si no es la primera página
  fs.appendFileSync(path, prefix + content, 'utf8');
};

// Función principal de scraping
const scrapper = async (url) => {
  deleteExistingFile(); // Eliminamos archivo anterior
  initializeFile(); // Inicializamos el archivo con '['

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  let isNextPageAvailable = true;
  let pageNum = 1;

  while (isNextPageAvailable && pageNum <= 9956) {
    console.log(`Scraping página: ${pageNum}`);

    const pageData = await scrapePage(page);
    writeDataToFile(pageData, pageNum === 1); // Añadimos datos

    isNextPageAvailable = await goToNextPage(page);
    pageNum++;
  }

  fs.appendFileSync(path, ']', 'utf8'); // Cerramos el array al final

  console.log("Scraping completado.");
  await browser.close();
};

module.exports = { scrapper };