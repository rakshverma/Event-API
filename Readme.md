# 🎟️ Event Management REST API


A full-featured Event Management backend built with **Node.js**, **Express**, and **PostgreSQL**. This API allows you to:

✅ Create events with capacity limits  
✅ Register users for events  
✅ Cancel registrations  
✅ List upcoming events with custom sorting  
✅ View event statistics  
✅ Secure your endpoints with an API key

---

## 🚀 Features

- Event CRUD (Create, View)
- Registration with capacity constraints
- Prevent double or past registrations
- Cancel registration
- List upcoming events, sorted by date and location
- Event statistics (registrations, capacity)
- Secure with API key middleware
- User creation endpoint

---

## 🧠 Tech Stack

- Node.js + Express
- PostgreSQL
- Knex.js
- dotenv
- nodemon (for development)
- PM2 or node (for production)

---

## 🏗️ Project Structure

```
.
├── knexfile.js
├── app.js
├── db/
│   └── knex.js
├── routes/
│   ├── eventRoutes.js
│   └── userRoutes.js
├── controllers/
│   └── eventController.js
├── middlewares/
│   └── apiKey.js
└── package.json
```

---

## 📜 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup PostgreSQL

Create your database:

```sql
CREATE DATABASE eventdb;
```

Connect:

```bash
\c eventdb
```

Create tables:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
);

CREATE TABLE registrations (
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);
```

You can manually insert users with:

```sql
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
```

### 4️⃣ Configure Environment Variables

Create a **.env** file in the root:

```ini
API_KEY=my-super-secret
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=eventdb
DB_HOST=127.0.0.1
DB_PORT=5432
```

### 5️⃣ Configure knexfile.js

```js
require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "9896",
      database: process.env.DB_NAME || "eventdb",
      port: process.env.DB_PORT || 5432,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      ssl:
        process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
```

### 6️⃣ Start the server

✅ Development (auto-reloads with nodemon):

```bash
npm run dev
```

✅ Production:

```bash
npm start
```

✅ With PM2 (recommended production):

```bash
pm2 start app.js --name "event-api"
```

---

## 🔐 Using the API Key

All routes require the header:

```
x-api-key: my-super-secret
```

---

## 📬 API Endpoints

All routes are prefixed with `/api`

### 📌 Events

✅ **Create Event**

```bash
POST /api/events
```

```json
{
  "title": "Tech Meetup",
  "date_time": "2025-09-20T10:00:00Z",
  "location": "Delhi",
  "capacity": 200
}
```

✅ **Get Event Details**

```bash
GET /api/events/:id
```

✅ **Register for Event**

```bash
POST /api/events/:id/register
```

```json
{
  "userId": 1
}
```

✅ **Cancel Registration**

```bash
DELETE /api/events/:id/register
```

```json
{
  "userId": 1
}
```

✅ **List Upcoming Events**

```bash
GET /api/events
```

✅ **Event Stats**

```bash
GET /api/events/:id/stats
```

---

## 🧪 Example Postman Usage

✅ Add Header:

```
x-api-key: my-super-secret
```

✅ Body (raw ➜ JSON) for POST endpoints.

✅ Test all routes locally on:

```bash
http://localhost:3000/api
```

---

## ⚡️ Development vs Production

| Environment | Command       | Tool    |
| ----------- | ------------- | ------- |
| Dev         | `npm run dev` | nodemon |
| Production  | `npm start`   | pm2     |
