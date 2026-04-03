import { Formula, type Ingredient } from "./Formula";
import type { Product } from "./Product";

import productsJson from './aic-products/products.json';

// Function to import files from require.context
function importAll(r: Rspack.Context) {
    let files = {};
    //@ts-ignore mapping strings should not be a problem
    r.keys().map(item => { files[item.replace('./', '')] = r(item); });
    return files;
}

export class Planner {
    // Products dictioanry.
    Products: {[key: string]: Product} = {};

    // Create new planner and load products and formulas.
    constructor(){
        this.LoadProducts(productsJson);
    }

    // Rebuild the products dictionary.
    // Check ./aic-products/products.json for how the products object should be formatted.
    LoadProducts(products: object): boolean{
        this.Products = {}; // Clear products dictionary to rebuild it.
        var FormulasAdded: number = 0;
        for(let productKey in products){
            var product = (products as any)[productKey];
            this.Products[productKey] = { // craete new product entry.
                Formulas: []
            };
            if('Formulas' in product){ //Add formulas or report malformed json property.
                for(let formulaKey in product['Formulas']){
                    var addFormula = AddJSONFormula(this, productKey, product['Formulas'][formulaKey]);
                    if(addFormula){
                        FormulasAdded++;
                    }else{
                        Error(`${productKey} Formulas property is malformed!`);
                    }
                }
            }else{
                Error(`${productKey} is missing Formulas property!`);
            }
        }
        console.log(`Loaded ${Object.keys(this.Products).length} products and ${FormulasAdded} formulas.`);
        return true;
    }

    // Exposed function to provide functionality to app.
    BuildProductChain(product: string, countPerMinute: number){
        const outputCanvas: HTMLCanvasElement | null = document.querySelector('#output-canvas'); // Temp get canvas.
        var ctx = null;
        if(outputCanvas){
            ctx = outputCanvas.getContext("2d");
            ctx?.clearRect(0,0,4000,3000);
        }
        this.depthWidthTable = {};
        this.productsCount = 0;
        this.GenerateProductChain(product, countPerMinute, 0, 0, ctx);
    }

    private depthWidthTable: {[key: number]: number} = {}; // Tracks how wide each depth layer is.
    private productsCount: number = 0; // How many products are in the chain used to tracking parents.
    // Function to generate chain of products needed to create product.
    private GenerateProductChain(productKey: string, countPerMinute: number, parent: number=0, depth: number = 0, canvasCtx2D: CanvasRenderingContext2D|null = null){
        if(depth == 0){ // Start chain.
            if(canvasCtx2D){ // If there is a canvas output the chain.
                canvasCtx2D.font = "1rem Arial";
                canvasCtx2D.fillStyle = "white";
                canvasCtx2D.fillText(`${productKey}(${countPerMinute}/min)`, 0, 100, 200);
            }
        }
        var product = this.Products[productKey];
        if(product == null){ // No product found.
            Error(`${productKey} Error in product chain!`);
            return;
        }
        var currentDepth = depth;
        if(this.depthWidthTable[currentDepth] == null) this.depthWidthTable[currentDepth] = 0; // Set depth table width to 0;
        depth++; // How deep in the chain we currently are.
        if(product.Formulas.length > 0){ // Product has components generate chain.
            var formula = product.Formulas[0]; // We will only use the first formula for now.
            var ingredientCount = 0;
            for(let ingredientsKey in formula.Ingredients){ // For each ingredient calculate how many we need.
                this.productsCount++;
                var myProductId = this.productsCount;
                ingredientCount++;
                var ingredient = formula.Ingredients[ingredientsKey];
                var ingredientsNeeded = countPerMinute*ingredient.count;
                this.GenerateProductChain(ingredient.name, ingredientsNeeded, this.productsCount, depth, canvasCtx2D);
                if(canvasCtx2D){ // If there is a canvas output the chain.
                    canvasCtx2D.font = "1rem Arial";
                    canvasCtx2D.fillStyle = "white";
                    canvasCtx2D.fillText(`(${parent}) [${formula.Crafting}] ${ingredient.name}(${ingredientsNeeded}/min) (${myProductId})`, 300*depth, ingredientCount*100+this.depthWidthTable[currentDepth]*100, 250);
                }
            }
            this.depthWidthTable[currentDepth] += formula.Ingredients.length; // Increase width by 1 for each ingredient.
        }
        return; // No formulas means base object end of chain.   
    }
    
}

// Helper for load products to add a formula to the product. Mainly for readability.
function AddJSONFormula(planner: Planner, productKey: string, formula: object): boolean {
    var toAddFormula: Formula = { // formula to load into our dictionary.
        Ingredients: [],
        Crafting: null,
        CraftingTime: 0,
        Outputs: []
    }
    // Ingredients property.
    if ("Ingredients" in formula && formula["Ingredients"] instanceof Array) {
        var ingredients = (formula as any)["Ingredients"];
        for (let ingredientKey in ingredients) {
            var ingredient = ingredients[ingredientKey];
            var newIngredient: Ingredient | false = ParseIngredientJSON(ingredient);
            if (!newIngredient) {
                Error(`${productKey} Ingredients is malformed!`);
                return false;
            }
            toAddFormula.Ingredients.push(newIngredient); // Add new ingredient.
        }
    } else {
        Error(`${productKey} Ingredients property is malformed!`);
        return false;
    }
    // Check crafting property.
    if ("Crafting" in formula && typeof formula["Crafting"] === 'string') {
        toAddFormula.Crafting = formula["Crafting"];
    } else {
        Error(`${productKey} Crafting property is malformed!`);
        return false;
    }
    // Crafting time property.
    if ("CraftingTime" in formula && typeof formula["CraftingTime"] === 'number') {
        toAddFormula.CraftingTime = formula["CraftingTime"];
    } else {
        Error(`${productKey} CraftingTime property is malformed!`);
        return false;
    }
    // Outputs property.
    if ("Outputs" in formula && formula["Outputs"] instanceof Array) {
        var outputs = (formula as any)["Outputs"];
        for (let outputKey in outputs) {
            var output = outputs[outputKey];
            var newOutput: Ingredient | false = ParseIngredientJSON(output);
            if (!newOutput) {
                Error(`${productKey} Outputs is malformed!`);
                return false;
            }
            toAddFormula.Outputs.push(newOutput);
        }
    } else {
        Error(`${productKey} Outputs property is malformed!`);
        return false;
    }
    // Add key to product dictionary.
    planner.Products[productKey].Formulas.push(toAddFormula);
    return true;
}

// Return false if failed to parse ingredient.
function ParseIngredientJSON(ingredient: object): Ingredient | false{
    var newIngredient: Ingredient = {
        name: "",
        count: 0
    }
    if ("name" in ingredient && typeof ingredient["name"] === 'string') { // Copy ingredient properties over.
        newIngredient.name = ingredient["name"];
    }else{
        return false
    }
    if ("count" in ingredient && typeof ingredient["count"] === 'number') {
        newIngredient.count = ingredient["count"];
    }else{
        return false;
    }
    return newIngredient;
}

// Helper function for errors.
function Error(message: string){
    console.log(message); // Need this function for later.
}