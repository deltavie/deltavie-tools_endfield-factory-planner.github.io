import { Camera } from "./Camera";
import type { GameObject } from "./GameObject";

class EngineObject {
    MainCamera: Camera = new Camera(); // Camera that is currently set as the main camera of the engine which the game will be rendered through.
    // Create objects.
    Instantiate(gameObject: GameObject){

    }
    // Delete objects.
    Destroy(gameObject: GameObject){

    }
    // Logic update.
    Clock(){
        
    }
    // Render update.
    Render(){

    }
}

export const Engine: EngineObject = new EngineObject();