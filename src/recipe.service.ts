export type Rezept = { id: number; titel: string; minuten: number; portionen: number };

let rezepte: Rezept[] = [
  { id: 1, titel: "Spaghetti Carbonara", minuten: 20, portionen: 2 },
  { id: 2, titel: "Linsen-Curry",        minuten: 35, portionen: 4 },
];

export async function getAllRecipes(): Promise<Rezept[]> {
  return rezepte;
}

export async function getRecipeById(id: number): Promise<Rezept | null> {
  return rezepte.find((r) => r.id === id) ?? null;
}

let naechsteId = 3;

export async function createRecipe(daten: Omit<Rezept, "id">): Promise<Rezept> {
  const neues: Rezept = { id: naechsteId++, ...daten };
  rezepte.push(neues);
  return neues;
}

export async function deleteRecipe(id: number): Promise<boolean> {
  const laengeVorher = rezepte.length;
  rezepte = rezepte.filter((r) => r.id !== id);
  return rezepte.length < laengeVorher;
}