const API_URL = "http://localhost:3000/api/v1/cryptos";

// Cargar cryptos aleatorias al inicio
window.onload = async () => {
  try {
    const response = await fetch(`${API_URL}/get?limit=10`);
    const data = await response.json();
    renderCryptos(data.data);
  } catch (error) {
    console.error("Error al cargar las criptomonedas:", error);
    showMessage("Error al cargar las criptomonedas.");
  }
};

// Buscar criptomoneda por nombre
document.getElementById("searchButton").addEventListener("click", async () => {
  const name = document.getElementById("searchInput").value;

  if (!name) {
    showMessage("Por favor, ingresa un nombre para buscar.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/search?name=${name}`);
    const data = await response.json();

    if (response.ok) {
      renderCryptos(data);
    } else {
      showMessage(data.message || "No se encontraron criptomonedas.");
    }
  } catch (error) {
    console.error("Error al buscar la criptomoneda:", error);
    showMessage("Error al buscar la criptomoneda.");
  }
});

// Renderizar los resultados
function renderCryptos(cryptos) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Limpiar resultados anteriores

  if (cryptos.length === 0) {
    showMessage("No se encontraron criptomonedas.");
    return;
  }

  cryptos.forEach((crypto) => {
    const cryptoElement = document.createElement("div");
    cryptoElement.innerHTML = `
      <h3>${crypto.longName} (${crypto.shortName})</h3>
      <p>Precio: ${crypto.price}</p>
      <img src="${crypto.img}" alt="${crypto.shortName}" width="50" />
    `;
    resultsDiv.appendChild(cryptoElement);
  });
}

// Mostrar mensajes de error o información
function showMessage(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = message;
}