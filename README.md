# 🚀 Crypto Scraper API + Frontend

This project is an API and a small frontend to **scrape cryptocurrency data** from Yahoo Finance, store it in **MongoDB**, and display it in a simple interface. It includes a search tool to quickly find cryptocurrencies! 🪙

---

## 🧰 **Technologies Used**

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Framework to build the API.
- **Puppeteer:** Tool for web scraping.
- **MongoDB:** NoSQL database to store data.
- **Mongoose:** ORM to manage the MongoDB connection and operations.
- **HTML, CSS, and JavaScript:** Simple frontend to interact with the API.

---

## 🌟 **Features**

- **Automatic Scraping:** Fetches real-time data from [Yahoo Finance](https://finance.yahoo.com/markets/crypto/all/).
- **Pagination and Random Display:** Shows random cryptos when the page loads.
- **Partial Search:** Finds cryptos with partial matches in their names.
- **Safe Storage:** Uses `upsert` to avoid duplicates in MongoDB.
- **Saved Progress:** Uses `progress.json` to resume scraping from where it stopped.

---

## 📁 **Project Structure**

```
/backend
 ├── /src
 │    ├── /api
 │    │    ├── /controllers
 │    │    │    └── cryptos.js  // API controllers
 │    │    ├── /models
 │    │    │    └── cryptos.js  // Mongoose model
 │    │    └── /routes
 │    │         └── cryptos.js  // API routes
 │    ├── /config
 │    │    └── db.js  // MongoDB connection
 │    ├── /utils
 │    │    ├── scrapper.js  // Scraper logic
 │    │    └── scrapperLaunch.js  // Scraper initialization
 │    └── index.js  // API entry point

/frontend
 ├── index.html  // User interface
 ├── style.css  // Frontend styles
 └── main.js  // Frontend logic
```

---

## 🔧 **Installation and Running Instructions**

### **1. Clone the Repository**

```bash
git clone <your-repository>
cd <your-repository>
```

### **2. Configure Environment Variables**

Create a `.env` file in the project root with the following content:

```
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority
```

### **3. Install Dependencies**

```bash
cd backend
npm install
```

### **4. Start the Scraper**

```bash
npm run scrap
```

### **5. Start the API**

```bash
npm run dev
```

### **6. Start the Frontend**

Open the `index.html` file in your browser to use the interface.

---

## 🔍 **API Endpoints**

### **1. Get Random Cryptos**
- **URL:** `/api/v1/cryptos/get`
- **Method:** `GET`
- **Description:** Returns a random set of cryptocurrencies.
- **Request Example:**
  ```http
  GET http://localhost:3000/api/v1/cryptos/get?limit=10
  ```

### **2. Search Crypto by Name**
- **URL:** `/api/v1/cryptos/search`
- **Method:** `GET`
- **Query Parameter:** `name` – Partial or full crypto name.
- **Request Example:**
  ```http
  GET http://localhost:3000/api/v1/cryptos/search?name=bitcoin
  ```
- **Response Example:**
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

## 🖥️ **Frontend Usage**

1. On page load, **random cryptos** are displayed.
2. Use the **search field** to find cryptos by name.
3. If no results are found, a message will indicate no matches.

---

## ⚠️ **How Duplicates Are Avoided**

- **MongoDB:** Uses `upsert` in operations to update existing documents or insert them if not present.
- **Local JSON:** Uses a `Map` to avoid duplicates in `cryptosData.json`.

---

## 👨‍💻 **Author**

Developed by [Your Name].

---

## 🎉 **Contributions**

Contributions are welcome! If you find any issues or have suggestions, feel free to open an **issue** or submit a **pull request**.

---

## 📄 **License**

This project is licensed under the MIT License.
