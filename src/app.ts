import express from "express";
import recipeRoutes from "./recipe.routes.ts";
import { logger } from "./logger.middleware.ts";
import { errorHandler } from "./error.middleware.ts";

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

// Bewusst kaputte Route: beweist, dass die Error-Middleware den Server stabil hält
app.get("/crash", () => {
  throw new Error("Absichtlicher Absturz zum Testen");
});

// 404-Fallback für unbekannte Routen (z. B. Tippfehler im Pfad)
app.use((req, res) => {
  res.status(404).json({ fehler: `Route ${req.method} ${req.originalUrl} existiert nicht` });
});

app.use(errorHandler);                 // muss NACH den Routen stehen

export default app;