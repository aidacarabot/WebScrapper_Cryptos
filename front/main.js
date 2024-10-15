let cryptos = [];  // Almacenar todas las criptomonedas
let displayedCryptos = 0;  // Número de criptomonedas mostradas en pantalla
const itemsPerLoad = 20;  // Cuántas criptomonedas cargar en cada batch

//? Opción Insomnia
// Hacer la solicitud a la API para obtener las criptomonedas
 fetch('http://localhost:3000/api/v1/cryptos/get')
   .then(response => response.json())
   .then(data => {
     cryptos = data;
     loadMoreCryptos();  
   })
   .catch(error => console.error('Error al cargar los datos:', error));


//? Opción 1
// Hacer la solicitud al archivo JSON local para obtener las criptomonedas
// fetch('cryptosData.json')  // Aquí llamas al archivo JSON directamente
//   .then(response => response.json())
//   .then(data => {
//     cryptos = data;  // Guardamos todas las criptomonedas
//     loadMoreCryptos();  // Cargamos los primeros datos
//   })
//   .catch(error => console.error('Error al cargar los datos:', error));


// Función para cargar más criptomonedas en pantalla cuando se hace scroll
function loadMoreCryptos() {
  const cryptoList = document.getElementById('crypto-list');
  const nextCryptos = cryptos.slice(displayedCryptos, displayedCryptos + itemsPerLoad);

  nextCryptos.forEach(crypto => {
    const cryptoCard = document.createElement('div');
    cryptoCard.classList.add('crypto-card');

    cryptoCard.innerHTML = `
      <img src="${crypto.img}" alt="${crypto.shortName}">
      <h2>${crypto.longName}</h2>
      <p>${crypto.price} USD</p>
    `;

    cryptoList.appendChild(cryptoCard);
  });

  displayedCryptos += itemsPerLoad;  // Actualizamos el número de criptos mostradas
}

// Detectar cuándo el usuario ha llegado al final de la página para cargar más
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreCryptos();  // Cargar más criptomonedas cuando se hace scroll hasta abajo
  }
});

// Función de debouncing para optimizar la búsqueda
let timeout = null;
document.getElementById('search-input').addEventListener('input', (event) => {
  clearTimeout(timeout);  // Limpiamos el timeout previo
  timeout = setTimeout(() => {
    const searchTerm = event.target.value.toLowerCase();  // Convertimos el término de búsqueda a minúsculas

    // Filtrar las criptomonedas según el término de búsqueda
    const filteredCryptos = cryptos.filter(crypto => {
      return crypto.longName.toLowerCase().includes(searchTerm) || 
             crypto.shortName.toLowerCase().includes(searchTerm);
    });

    displayFilteredCryptos(filteredCryptos);  // Mostramos las criptomonedas filtradas
  }, 300);  // Ejecutar la búsqueda 300ms después de que el usuario haya dejado de escribir
});

// Función para mostrar las criptomonedas filtradas
function displayFilteredCryptos(filteredCryptos) {
  const cryptoList = document.getElementById('crypto-list');
  cryptoList.innerHTML = '';  // Limpiar la lista actual

  filteredCryptos.forEach(crypto => {
    const cryptoCard = document.createElement('div');
    cryptoCard.classList.add('crypto-card');

    cryptoCard.innerHTML = `
      <img src="${crypto.img}" alt="${crypto.shortName}">
      <h2>${crypto.longName}</h2>
      <p>${crypto.price} USD</p>
    `;

    cryptoList.appendChild(cryptoCard);
  });
}