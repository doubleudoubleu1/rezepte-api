import { Request, Response, NextFunction } from "express";
import { getAllRecipes, getRecipeById, createRecipe, deleteRecipe, addZutatToRecipe, updateRecipe } from "./recipe.service.ts";

export async function getRecipesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rezepte = await getAllRecipes();
    res.json(rezepte);
  } catch (err) {
    next(err);
  }
}

export async function getRecipeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const rezept = await getRecipeById(id);   // wirft RecipeNotFoundError bei fehlender ID
    res.json(rezept);
  } catch (err) {
    next(err);
  }
}

export async function createRecipeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const neues = await createRecipe(req.body);
    res.status(201).json(neues);        // 201 = Created
  } catch (err) {
    next(err);
  }
}

export async function deleteRecipeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const erfolg = await deleteRecipe(id);

    if (!erfolg) {
      return res.status(404).json({ fehler: "Rezept nicht gefunden" });
    }
    res.status(204).send();             // 204 = No Content, kein Body
  } catch (err) {
    next(err);
  }
}

// --- BONUS: Zutat zu einem Rezept hinzufügen ---
export async function addZutatHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rezeptId = Number(req.params.id);
    const { zutatId, menge } = req.body;
    await addZutatToRecipe(rezeptId, Number(zutatId), menge);
    res.status(201).json({ ok: true, rezeptId, zutatId, menge });
  } catch (err) {
    next(err);
  }
}

// --- BONUS: Rezept aktualisieren ---
export async function updateRecipeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const aktualisiert = await updateRecipe(id, req.body);
    res.json(aktualisiert);
  } catch (err) {
    next(err);
  }
}