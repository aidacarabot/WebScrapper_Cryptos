const puppeteer = require("puppeteer");
const fs = require("fs");

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

      // Imprime los valores de cada criptomoneda para verificar si los datos están llegando correctamente
      console.log({ img, shortName, longName, price });

      // Verificamos que todos los campos tengan valor antes de añadirlos
      if (img && shortName && longName && price) {
        const crypto = {
          shortName,
          img,
          longName,
          price,
        };

        cryptos.push(crypto);
      }
    });

    return cryptos; // Devolvemos los datos de la página actual
  });
};


// Función para pasar a la siguiente página
const goToNextPage = async (page) => {
  try {
    const nextButton = await page.$$('button.icon-btn');
    if (nextButton && nextButton.length > 2) {
      await nextButton[2].click(); // Hacemos clic en el tercer botón "icon-btn"
      await new Promise(resolve => setTimeout(resolve, 3000)); // Esperamos 3 segundos
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al intentar pasar a la siguiente página:", error);
    return false;
  }
};

// Función para escribir los datos en el archivo JSON conforme se scrapea
const writeDataToFile = (data) => {
  if (!fs.existsSync("cryptosData.json")) {
    // Si el archivo no existe, creamos el archivo y abrimos el array
    fs.writeFileSync("cryptosData.json", '[' + JSON.stringify(data, null, 2)); 
  } else {
    // Si el archivo ya existe, añadimos la nueva data (sin sobrescribir todo)
    fs.appendFileSync("cryptosData.json", ',' + JSON.stringify(data, null, 2).slice(1, -1));
  }
};

// Función principal de scraping
const scrapper = async (url) => {
  const browser = await puppeteer.launch({ headless: true }); // Cambiado a "headless: true" para mayor velocidad
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  let isNextPageAvailable = true;
  let pageNum = 1;

  // Si ya existe el archivo, lo eliminamos para evitar que se mezclen datos viejos
  if (fs.existsSync("cryptosData.json")) {
    fs.unlinkSync("cryptosData.json");
  }

  while (isNextPageAvailable && pageNum <= 9956) { // Recorremos hasta 9956 páginas
    console.log(`Scraping página: ${pageNum}`);

    // Extraemos los datos de la página actual
    const pageData = await scrapePage(page);
    
    // Escribimos los datos de la página actual en el archivo JSON
    writeDataToFile(pageData);

    // Intentamos ir a la siguiente página
    isNextPageAvailable = await goToNextPage(page);
    pageNum++;
  }

  // Cerramos el array al final del proceso
  fs.appendFileSync("cryptosData.json", ']');

  console.log("Scraping completado.");
  await browser.close();
};

module.exports = { scrapper };
