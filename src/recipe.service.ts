import { RecipeNotFoundError, ValidationError } from "./errors.ts";

export type Zutat = { name: string; menge: string };

export type Rezept = {
  id: number;
  titel: string;
  minuten: number;
  portionen: number;
  zutaten?: Zutat[];        // nur bei getRecipeById gefüllt (Detail-Ansicht)
};

import {
  getAllRecipes as getAllFromDb,
  getRecipeById as getByIdFromDb,
  createRecipe as createInDb,
  deleteRecipe as deleteInDb,
  addZutatToRecipe as addZutatInDb,
  updateRecipe as updateInDb,
} from "./recipe.repo.ts";

export async function getAllRecipes(): Promise<Rezept[]> {
  return getAllFromDb();
}

export async function getRecipeById(id: number): Promise<Rezept> {
  const rezept = await getByIdFromDb(id);

  if (!rezept) {
    throw new RecipeNotFoundError(id);
  }
  return rezept;
}

export async function createRecipe(daten: Omit<Rezept, "id">): Promise<Rezept> {
  if (!daten.titel || daten.titel.trim() === "") {
    throw new ValidationError("Ein Rezept braucht einen Titel");
  }
  return createInDb(daten.titel, daten.minuten, daten.portionen);
}

export async function deleteRecipe(id: number): Promise<boolean> {
  const existiert = await getByIdFromDb(id);
  if (!existiert) {
    return false;
  }
  await deleteInDb(id);
  return true;
}

// --- BONUS ---

export async function addZutatToRecipe(rezeptId: number, zutatId: number, menge: string): Promise<void> {
  if (!menge || menge.trim() === "") {
    throw new ValidationError("Die Menge darf nicht leer sein");
  }
  const rezept = await getByIdFromDb(rezeptId);
  if (!rezept) {
    throw new RecipeNotFoundError(rezeptId);
  }
  await addZutatInDb(rezeptId, zutatId, menge);
}

export async function updateRecipe(id: number, daten: { titel?: string; minuten?: number; portionen?: number }): Promise<Rezept> {
  if (daten.titel !== undefined && daten.titel.trim() === "") {
    throw new ValidationError("Ein Rezept braucht einen Titel");
  }
  const aktualisiert = await updateInDb(id, daten);
  if (!aktualisiert) {
    throw new RecipeNotFoundError(id);
  }
  return aktualisiert;
}
