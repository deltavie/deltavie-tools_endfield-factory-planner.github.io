import { Camera } from "./Camera";
import { GameObject } from "./GameObject";
import { Mouse, MouseButtons } from "./Mouse";

class EngineObject {
    MainCamera: Camera = new Camera(); // Camera that is currently set as the main camera of the engine which the game will be rendered through.
    GameObjects: GameObject[] = [];
    CurrentMouse: Mouse = new Mouse();

    // Rendering contexts.
    CanvasContext2D: CanvasRenderingContext2D|null = null;
    CanvasWidth: number = 0;
    CanvasHeight: number = 0;

    // Initialize engine for 2DHtmlCanvas
    Initialize2DHtmlCanvas(htmlCanvas: HTMLCanvasElement){
        this.CanvasContext2D =  htmlCanvas.getContext("2d");
        this.CanvasWidth =  htmlCanvas.width;
        this.CanvasHeight = htmlCanvas.height;
    }

    // Call to update canvas size, i.e. when window changes size.
    UpdateCanvasSize(width: number, height: number){
        this.CanvasWidth = width;
        this.CanvasHeight = height;
    }

    // Create objects.
    CreateList: GameObject[] = []; // same reason as destroy.
    Instantiate(gameObject: GameObject){
        //if(this.CreateList.findIndex((obj) => obj == gameObject) >= 0) return;
        this.CreateList.push(gameObject);
    }

    // Delete objects.
    DestroyList: GameObject[] = []; // Need to do this step before updating to prevent changing Gameobjects list while looping.
    Destroy(gameObject: GameObject){
        //if(this.DestroyList.findIndex((obj) => obj == gameObject) >= 0) return;
        this.DestroyList.push(gameObject);
    }
    
    // Logic update.
    Clock(){
        // Destroy objects.
        var objectsDestroyedThisLoop: number[] = [];
        for(var i=0; i < this.DestroyList.length; i++){
            var index = this.GameObjects.findIndex((obj) => obj === this.DestroyList[i]);
            if(index >= 0) this.GameObjects.splice(index, 1);
            this.DestroyList[i].Destroy();
            objectsDestroyedThisLoop.push(i);
        }
        for(let objIndex in objectsDestroyedThisLoop){ // Remove objects created this loop from create list.
            this.DestroyList.splice(objectsDestroyedThisLoop[objIndex], 1);
        }
        // Create objects.
        var objectsCreatedThisLoop: number[] = []; // Track which objects are created this loop.
        for(var i=0; i < this.CreateList.length; i++){
            this.GameObjects.push(this.CreateList[i]);
            this.CreateList[i].Create();
            objectsCreatedThisLoop.push(i);
        }
        for(let objIndex in objectsCreatedThisLoop){ // Remove objects created this loop from create list.
            this.CreateList.splice(objectsCreatedThisLoop[objIndex], 1);
        }
        this.CreateList = [];
        // Update objects.
        for(let objKey in this.GameObjects){
            this.GameObjects[objKey].Update();
        }
    }

    // Render update.
    Render(){
        if(this.CanvasContext2D) this.CanvasContext2D.clearRect(0, 0, this.CanvasWidth, this.CanvasHeight);
        // Sort objects by z;
        this.GameObjects.sort((a,b) => a.Transform.Position.z-b.Transform.Position.z);
        // Render objects.
        for(var i=0; i < this.GameObjects.length; i++){
            var obj = this.GameObjects[i];
            obj.RelativeTransform = {
                Position: {
                    x: this.MainCamera.Transform.Position.x - obj.Transform.Position.x + this.CanvasWidth/2,
                    y: this.MainCamera.Transform.Position.y - obj.Transform.Position.y + this.CanvasHeight/2,
                    z: this.MainCamera.Transform.Position.z - obj.Transform.Position.z,
                }
            }
            obj.Render();
        }
    }

    // Update mouse position.
    UpdateMousePosition(x: number, y: number){
        this.CurrentMouse.x = x;
        this.CurrentMouse.y = y;
    }

    // Update mouse state.
    UpdateMouseState(btn: MouseButtons, state: boolean){
        this.CurrentMouse.Buttons[btn] = state;
    }
}

export const Engine: EngineObject = new EngineObject();