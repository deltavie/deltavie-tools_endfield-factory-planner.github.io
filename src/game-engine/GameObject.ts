import { Engine } from "./Engine";
import type { Vec3 } from "./interfaces";

interface Transform{
    Position: Vec3;
}

export class GameObject {
    Transform: Transform = { // True transform to world space coordinates.
        Position: {
            x: 0,
            y: 0,
            z: 0
        }
    }
    CameraTranslatedTransform: Transform = { // Transform relative to camera.
        Position: {
            x: 0,
            y: 0,
            z: 0
        }
    }
    // Called by the engine when created in the scene.
    Create(){}
    // Called by the engine when destroyed in the scene.
    Destroy(){}
    // Called by the engine everytime clock is called.
    Update(){
        // Calculate relative transform.
        this.CameraTranslatedTransform.Position.x = Engine.MainCamera.Transform.Position.x - this.Transform.Position.x;
        this.CameraTranslatedTransform.Position.y = Engine.MainCamera.Transform.Position.y - this.Transform.Position.y;
        this.CameraTranslatedTransform.Position.z = Engine.MainCamera.Transform.Position.z - this.Transform.Position.z;
    }
    // Called by the engine everytime render is called.
    Render(){}
}