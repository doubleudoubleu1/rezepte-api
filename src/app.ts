import express from "express";
import recipeRoutes from "./recipe.routes";
import { logger } from "./logger.middleware";
import { errorHandler } from "./error.middleware";

const app = express();
app.use(express.json());
app.use(logger);              

app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/recipes", recipeRoutes);

// 404-Fallback für unbekannte Routen (z. B. Tippfehler im Pfad)
app.use((req, res) => {
  res.status(404).json({ fehler: `Route ${req.method} ${req.originalUrl} existiert nicht` });
});

app.use(errorHandler);                 // muss NACH den Routen stehen

export default app;