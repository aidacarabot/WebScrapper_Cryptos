# Crypto Scraper API

Este proyecto es una API que realiza scraping de criptomonedas desde Yahoo Finance, guarda los datos en MongoDB y mantiene un respaldo en `cryptosData.json`. El progreso del scraping se almacena en `progress.json` para reanudar automáticamente en caso de interrupción o fallo.

## **Endpoints del Proyecto**

### **1. Obtener todas las criptomonedas**
- **URL:** `/api/v1/cryptos/get`
- **Método:** `GET`
- **Descripción:** 
  Este endpoint devuelve una lista con todas las criptomonedas almacenadas en la base de datos.
- **Ejemplo de Respuesta:**
  ```json
  [
    {
      "shortName": "BTC",
      "longName": "Bitcoin",
      "img": "https://crypto-image-url.com",
      "price": "30000",
      "_id": "64c6e72c8a1b4e2f12345678",
      "createdAt": "2024-10-22T08:53:32.123Z",
      "updatedAt": "2024-10-22T08:53:32.123Z"
    }
  ] 
  
 ## 2. Guardar nuevas criptomonedas

- **URL:** `/api/v1/cryptos/save`
- **Método:** `POST`
- **Descripción:**
  Inserta o actualiza criptomonedas en la base de datos desde el archivo `cryptosData.json`. Si una criptomoneda con el mismo `shortName` ya existe, se actualiza con los datos más recientes.

- **Ejemplo de Respuesta Exitosa:**
  ```json
  {
    "message": "Todas las criptomonedas han sido subidas a la base de datos."
  }
  
 ## Funcionalidades Principales

- **Scraping Automático:**  
  Obtiene datos en tiempo real de criptomonedas desde [Yahoo Finance](https://finance.yahoo.com/markets/crypto/all/).

- **Almacenamiento en MongoDB:**  
  Los datos se guardan en la base de datos utilizando la operación `upsert` para evitar duplicados, es decir, actualiza si ya existe o inserta si no.

- **Respaldo en JSON:**  
  Además del almacenamiento en MongoDB, los datos se guardan en un archivo `cryptosData.json` como copia local.

- **Progreso Guardado:**  
  Utiliza el archivo `progress.json` para registrar la última página procesada, permitiendo reanudar el scraping desde donde se interrumpió.


## Instrucciones de Ejecución

### 1. Instalar Dependencias
Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DB_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority
```

Reemplaza `<usuario>`, `<contraseña>` y `miBaseDeDatos` con tus credenciales reales.

### 3. Iniciar el Scraper
Para comenzar el scraping y guardar los datos en MongoDB y en `cryptosData.json`, ejecuta:

```bash
npm run scrap
```

### 4. Iniciar la API
Si deseas levantar la API para consultar los datos almacenados en MongoDB, utiliza:

```bash
npm run dev
```

## Tecnologías Utilizadas

- **Node.js:** Entorno de ejecución para JavaScript.
- **Express.js:** Framework para construir la API.
- **Puppeteer:** Herramienta para hacer scraping web.
- **MongoDB:** Base de datos NoSQL para almacenar los datos.
- **Mongoose:** ORM para manejar la conexión y operaciones en MongoDB.

## Cómo se Evitan Duplicados

- **En MongoDB:**  
  Usamos la opción `upsert` en las operaciones para actualizar documentos existentes o insertarlos si no están presentes.

- **En `cryptosData.json`:**  
  Utilizamos un `Map` para gestionar los datos y evitar duplicados en el archivo JSON local.