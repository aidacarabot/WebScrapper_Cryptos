
# 🚀 Crypto Scraper API + Frontend

Este proyecto es una API y un pequeño frontend para **scrapear datos de criptomonedas** desde Yahoo Finance, almacenarlos en **MongoDB**, y mostrarlos en una interfaz sencilla. ¡Incluye un buscador para encontrar criptomonedas rápidamente! 🪙

---

## 🧰 **Tecnologías Utilizadas**

- **Node.js:** Entorno de ejecución para JavaScript.
- **Express.js:** Framework para construir la API.
- **Puppeteer:** Herramienta para hacer scraping web.
- **MongoDB:** Base de datos NoSQL para almacenar los datos.
- **Mongoose:** ORM para manejar la conexión y operaciones en MongoDB.
- **HTML, CSS y JavaScript:** Frontend sencillo para interactuar con la API.

---

## 🌟 **Características**

- **Scraping Automático:** Obtiene datos en tiempo real desde [Yahoo Finance](https://finance.yahoo.com/markets/crypto/all/).
- **Paginación y Muestra Aleatoria:** Muestra criptos aleatorias al cargar la página.
- **Búsqueda Parcial:** Encuentra criptos con coincidencias parciales en los nombres.
- **Almacenamiento Seguro:** Uso de `upsert` para evitar duplicados en MongoDB.
- **Progreso Guardado:** Utiliza `progress.json` para reanudar el scraping desde donde se interrumpió.

---

## 📁 **Estructura del Proyecto**

```
/backend
 ├── /src
 │    ├── /api
 │    │    ├── /controllers
 │    │    │    └── cryptos.js  // Controladores de la API
 │    │    ├── /models
 │    │    │    └── cryptos.js  // Modelo de Mongoose
 │    │    └── /routes
 │    │         └── cryptos.js  // Rutas de la API
 │    ├── /config
 │    │    └── db.js  // Conexión a MongoDB
 │    ├── /utils
 │    │    ├── scrapper.js  // Lógica del scrapper
 │    │    └── scrapperLaunch.js  // Inicialización del scrapper
 │    └── index.js  // Punto de entrada de la API

/frontend
 ├── index.html  // Interfaz de usuario
 ├── style.css  // Estilos del frontend
 └── main.js  // Lógica del frontend
```

---

## 🔧 **Instrucciones de Instalación y Ejecución**

### **1. Clonar el Repositorio**

```bash
git clone <tu-repositorio>
cd <tu-repositorio>
```

### **2. Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DB_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority
```

### **3. Instalar Dependencias**

```bash
cd backend
npm install
```

### **4. Iniciar el Scraper**

```bash
npm run scrap
```

### **5. Iniciar la API**

```bash
npm run dev
```

### **6. Iniciar el Frontend**

Abre el archivo `index.html` en tu navegador para usar la interfaz.

---

## 🔍 **Endpoints de la API**

### **1. Obtener Criptos Aleatorias**
- **URL:** `/api/v1/cryptos/get`
- **Método:** `GET`
- **Descripción:** Devuelve un conjunto aleatorio de criptomonedas.
- **Ejemplo de Solicitud:**
  ```http
  GET http://localhost:3000/api/v1/cryptos/get?limit=10
  ```

### **2. Buscar Cripto por Nombre**
- **URL:** `/api/v1/cryptos/search`
- **Método:** `GET`
- **Query Parameter:** `name` – Nombre parcial o completo de la cripto.
- **Ejemplo de Solicitud:**
  ```http
  GET http://localhost:3000/api/v1/cryptos/search?name=bitcoin
  ```
- **Ejemplo de Respuesta:**
  ```json
  [
    {
      "_id": "64c6e72c8a1b4e2f12345678",
      "shortName": "BTC",
      "longName": "Bitcoin",
      "img": "https://crypto-image-url.com",
      "price": "30000",
      "createdAt": "2024-10-22T08:53:32.123Z",
      "updatedAt": "2024-10-22T08:53:32.123Z"
    }
  ]
  ```

---

## 🖥️ **Uso del Frontend**

1. Al cargar la página, se mostrarán **criptos aleatorias**.
2. Usa el **campo de búsqueda** para buscar criptos por nombre.
3. Si no se encuentran resultados, se mostrará un mensaje indicando que no hay coincidencias.

---

## ⚠️ **Cómo se Evitan Duplicados**

- **MongoDB:** Usamos `upsert` en las operaciones para actualizar documentos existentes o insertarlos si no están presentes.
- **JSON Local:** Usamos un `Map` para evitar duplicados en `cryptosData.json`.

---

## 👨‍💻 **Autor**

Desarrollado por [Tu Nombre].

---

## 🎉 **Contribuciones**

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes sugerencias, no dudes en abrir un **issue** o enviar un **pull request**.

---

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. 
