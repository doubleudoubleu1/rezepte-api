import app from "./app.ts";
import { getPostgresPool } from "./pool.postgres.ts";

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

// BONUS: Pool beim Beenden sauber schließen
process.on("SIGINT", () => {
  console.log("\nServer wird beendet, Connection-Pool wird geschlossen...");
  getPostgresPool().end().finally(() => process.exit(0));
});
