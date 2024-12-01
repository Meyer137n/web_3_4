const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Настройки подключения к PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "dragen23",
  port: 5432,
});

// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword]
    );

    const userId = userResult.rows[0].id;

    // Создаём пустую заметку для нового пользователя
    await client.query("INSERT INTO notes (user_id, text) VALUES ($1, $2)", [
      userId,
      "",
    ]);

    await client.query("COMMIT");

    res.status(201).json({ message: "User registered and note created successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// Middleware для аутентификации
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1]; // Ожидается заголовок вида "Bearer <token>"

  try {
    const decoded = jwt.verify(token, "secret_key"); // Верификация токена
    req.user = decoded; // Сохраняем данные пользователя в `req` для последующего использования
    next(); // Передаём управление следующему обработчику
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Авторизация
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, "secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Получение заметки пользователя
app.get("/note", authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query("SELECT text FROM notes WHERE user_id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found for this user" });
    }

    res.status(200).json({ text: result.rows[0].text });
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Обновление заметки
app.put("/note", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { text } = req.body;

  try {
    const result = await pool.query(
      "UPDATE notes SET text = $1 WHERE user_id = $2 RETURNING text",
      [text, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found for this user" });
    }

    res.status(200).json({
      message: "Note updated successfully",
      text: result.rows[0].text,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
