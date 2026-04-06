import { Engine } from "../../game-engine/Engine";
import { GameObject } from "../../game-engine/GameObject";
import type { Vec3 } from "../../game-engine/interfaces";

export class NodeConnectionLine extends GameObject { // Line object between nodes.
    Target: Vec3 = {
        x: 0,
        y: 0,
        z: 0,
    }
    Render(){
        if(!Engine.CanvasContext2D) return;
        var ctx = Engine.CanvasContext2D;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
        ctx.moveTo(this.RelativeTransform.Position.x, this.RelativeTransform.Position.y);
        ctx.lineTo(this.Target.x, this.Target.y);
        ctx.stroke();
    }
}