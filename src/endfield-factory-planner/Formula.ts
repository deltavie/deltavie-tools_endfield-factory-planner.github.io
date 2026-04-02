import type { CraftingStation } from "./CraftingStation";

export interface Ingredient {
    name: string,
    count: number
}

export class Formula {
    Ingredients: Ingredient[] = [];
    Crafting: CraftingStation| string | null = null;
    CraftingTime: number = 0;
    Outputs: Ingredient[] = [];

    constructor(ingredients: Ingredient[], craftingStation: CraftingStation, craftingTime: number, outputs: Ingredient[]){
        this.Ingredients = ingredients;
        this.Crafting = craftingStation;
        this.CraftingTime = craftingTime;
        this.Outputs = outputs;
    }
}