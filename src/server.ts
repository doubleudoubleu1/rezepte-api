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


type Rezept = {
  id: number;
  titel: string;
  minuten: number;
  portionen: number;
  zutaten: string[];
  anleitung: string;
  bewertung: number;
};

const rezepte: Rezept[] = [
  {
    id: 1,
    titel: "Spaghetti Carbonara",
    minuten: 20,
    portionen: 2,
    zutaten: ["Spaghetti", "Eigelb", "Pecorino", "Schinkenspeck", "Pfeffer"],
    anleitung: "Nudeln kochen, Speck braten, Eigelb mit Käse und Pfeffer zu einer Soße rühren, mit der Nudlenwasser zusammenbinden.",
    bewertung: 4.7,
  },
  {
    id: 2,
    titel: "Linsen-Curry",
    minuten: 35,
    portionen: 4,
    zutaten: ["rote Linsen", "Kokosmilch", "Currypaste", "Karotten", "Kokosöl"],
    anleitung: "Linsen mit gewürfelter Karotte in Kokosöl anbraten, Currypaste dazugeben, Kokosmilch angießen und 20 Minuten köcheln lassen.",
    bewertung: 4.5,
  },
  {
    id: 3,
    titel: "Zucchini-Pasta",
    minuten: 15,
    portionen: 2,
    zutaten: ["Zucchini", "Pasta", "Zitronenöl", "Parmesan"],
    anleitung: "Zucchini spiralisieren, mit der abgetropften Pasta in der Pfanne anbraten und mit Zitronenöl und Parmesan servieren.",
    bewertung: 4.2,
  },
];

// Endpunkt 1 — alle Rezepte (optional gefiltert per ?maxMinuten=)
app.get("/recipes", (req, res) => {
  const maxMinuten = Number(req.query.maxMinuten);
  const ergebnis =
    req.query.maxMinuten && !Number.isNaN(maxMinuten)
      ? rezepte.filter((r) => r.minuten <= maxMinuten)
      : rezepte;
  res.json(ergebnis);
});

// Endpunkt 2 — ein Rezept über die ID
app.get("/recipes/:id", (req, res) => {
  const id = Number(req.params.id); // String → Zahl!
  const rezept = rezepte.find((r) => r.id === id);

  if (!rezept) {
    return res.status(404).json({ fehler: "Rezept nicht gefunden" });
  }
  res.json(rezept);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});