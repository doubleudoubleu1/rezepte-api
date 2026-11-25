import { getPostgresPool } from "./pool.postgres.ts";
import type { Rezept } from "./recipe.service.ts";

const pool = getPostgresPool();

// --- MUSTER (vorgegeben): alle Rezepte lesen (flach, ohne Zutaten) ---
export async function getAllRecipes(): Promise<Rezept[]> {
  const res = await pool.query(
    "SELECT id, titel, minuten, portionen FROM rezepte ORDER BY id"
  );
  return res.rows;              // immer ein Array — auch bei einer Zeile
}

// --- ein Rezept anlegen ---
export async function createRecipe(titel: string, minuten: number, portionen: number): Promise<Rezept> {
  const res = await pool.query(
    "INSERT INTO rezepte (titel, minuten, portionen) VALUES ($1, $2, $3) RETURNING id, titel, minuten, portionen",
    [titel, minuten, portionen]
  );
  return res.rows[0];           // das eine neue Rezept
}

// --- ein Rezept MIT seinen Zutaten lesen (ZWEI Queries, nicht ein JOIN) ---
export async function getRecipeById(id: number): Promise<Rezept | null> {
  // 1) das Rezept
  const res = await pool.query(
    "SELECT id, titel, minuten, portionen FROM rezepte WHERE id = $1",
    [id]
  );
  const rezept = res.rows[0];
  if (!rezept) return null;     // nicht gefunden

  // 2) seine Zutaten per JOIN über die Zwischentabelle
  const zutatenRes = await pool.query(
    "SELECT z.name, rz.menge FROM rezept_zutaten rz JOIN zutaten z ON z.id = rz.zutat_id WHERE rz.rezept_id = $1",
    [id]
  );

  return { ...rezept, zutaten: zutatenRes.rows };
}

// --- ein Rezept löschen ---
export async function deleteRecipe(id: number): Promise<void> {
  await pool.query("DELETE FROM rezepte WHERE id = $1", [id]);
  // Die Verknüpfungen in rezept_zutaten verschwinden dank ON DELETE CASCADE automatisch mit.
}

// --- BONUS: eine Zutat zu einem Rezept hinzufügen ---
export async function addZutatToRecipe(rezeptId: number, zutatId: number, menge: string): Promise<void> {
  await pool.query(
    "INSERT INTO rezept_zutaten (rezept_id, zutat_id, menge) VALUES ($1, $2, $3)",
    [rezeptId, zutatId, menge]
  );
}

// --- BONUS: ein Rezept aktualisieren (partiell: nur mitgegebene Felder) ---
export async function updateRecipe(
  id: number,
  daten: { titel?: string; minuten?: number; portionen?: number }
): Promise<Rezept | null> {
  const res = await pool.query(
    "UPDATE rezepte SET titel = COALESCE($2, titel), minuten = COALESCE($3, minuten), portionen = COALESCE($4, portionen) WHERE id = $1 RETURNING id, titel, minuten, portionen",
    [id, daten.titel ?? null, daten.minuten ?? null, daten.portionen ?? null]
  );
  return res.rows[0] ?? null;   // null, wenn das Rezept nicht existiert
}
