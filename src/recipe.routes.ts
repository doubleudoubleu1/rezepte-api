import { Router } from "express";
import { getRecipesHandler, getRecipeHandler, createRecipeHandler, deleteRecipeHandler, addZutatHandler, updateRecipeHandler } from "./recipe.controller.ts";
import { requireApiKey } from "./auth.middleware.ts";

const router = Router();
router.get("/", getRecipesHandler);
router.get("/:id", getRecipeHandler);

router.post("/", createRecipeHandler);
router.delete("/:id", requireApiKey, deleteRecipeHandler);

// BONUS: CRUD komplett — Zutaten schreiben, Rezept aktualisieren
router.post("/:id/zutaten", addZutatHandler);
router.patch("/:id", updateRecipeHandler);

export default router;