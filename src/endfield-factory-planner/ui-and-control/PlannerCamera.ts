import { Camera } from "../../game-engine/Camera";
import { Engine } from "../../game-engine/Engine";
import type { Vec3 } from "../../game-engine/interfaces";
import { MouseButtons } from "../../game-engine/Mouse";

export class PlannerCamera extends Camera {
    // Drag camera function.
    private dragging: boolean = false;
    private startDragCameraPosition: Vec3 = {
        x: 0,
        y: 0,
        z: 0,
    }
    private  startDragMousePosition: Vec3 = {
        x: 0,
        y: 0,
        z: 0,
    }

    Update(): void {
        if(Engine.CurrentMouse.Buttons[MouseButtons.MOUSE2] == true){ //Reset
            this.Transform.Position = {
                x: 0,
                y: 0,
                z: 0
            }
        }
        if(Engine.CurrentMouse.Buttons[MouseButtons.MOUSE1] == true){ // Drag.
            if(this.dragging == false){ // Save drag start position.
                this.dragging = true;
                this.startDragCameraPosition = this.Transform.Position;
                this.startDragMousePosition.x = Engine.CurrentMouse.x;
                this.startDragMousePosition.y = Engine.CurrentMouse.y;
            }else{ // Translate camera based on drag difference.
                var xDiff = this.startDragMousePosition.x - Engine.CurrentMouse.x;
                var yDiff = this.startDragMousePosition.y - Engine.CurrentMouse.y;
                this.startDragMousePosition.x = Engine.CurrentMouse.x;
                this.startDragMousePosition.y = Engine.CurrentMouse.y;
                this.Transform.Position.x = this.startDragCameraPosition.x - xDiff;
                this.Transform.Position.y = this.startDragCameraPosition.y - yDiff;
            }
        }else{
            this.dragging = false;
        }
    }
}