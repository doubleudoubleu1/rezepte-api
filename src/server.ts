import express from "express";

const app = express();
app.use(express.json());        // erlaubt dem Server, JSON im Request-Body zu lesen

// Begrüßung auf der Startseite
app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋");
});

// Health-Check: läuft der Server?
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});