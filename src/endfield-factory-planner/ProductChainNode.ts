import { Engine } from "../game-engine/Engine";
import { GameObject } from "../game-engine/GameObject";
import { NodeConnectionLine } from "./ui-and-control/NodeConnectionLine";

export class ProductChainNode extends GameObject {
    // Connections.
    ParentNodes: ProductChainNode[] = [];
    ChildNodes: ProductChainNode[] = [];
    // Node properties.
    ProductName: string = "";
    ProductQuantity: number = 0;
    CraftingStation: string | null = ""
    // Visualization properties.
    Depth: number = 0; // How far down the chain to display this node.
    Width: number = 0; // How far down the width of the chain to display this node.
    ConnectionLinesParents: NodeConnectionLine[] = [];
    ConnectionLinesChildren: NodeConnectionLine[] = [];
    // Create this node set initial position based on Depth and Width.
    Create(): void {
        this.Transform.Position.x = 250*this.Depth;
        this.Transform.Position.y = 150*this.Width;
        for(let parent in this.ParentNodes){ // Create connection lines.
            var newLine = new NodeConnectionLine();
            newLine.Transform.Position = this.Transform.Position;
            newLine.Target.x = this.ParentNodes[parent].Transform.Position.x;
            newLine.Target.y = this.ParentNodes[parent].Transform.Position.x;
            newLine.Transform.Position.z = -1;
            this.ConnectionLinesParents.push(newLine);
            Engine.Instantiate(newLine);
        }
        for(let child in this.ChildNodes){
            var newLine = new NodeConnectionLine();
            newLine.Transform.Position = this.Transform.Position;
            newLine.Target.x = this.ChildNodes[child].Transform.Position.x;
            newLine.Target.y = this.ChildNodes[child].Transform.Position.x;
            newLine.Transform.Position.z = -1;
            this.ConnectionLinesChildren.push(newLine);
            Engine.Instantiate(newLine);
        }
    }
    Destroy(): void {
        for(let parentConnection in this.ConnectionLinesParents){  // Clean up all connected node connection lines.
            Engine.Destroy(this.ConnectionLinesParents[parentConnection]);
        }
        this.ConnectionLinesParents = [];
        for(let childConnection in this.ConnectionLinesChildren){
            Engine.Destroy(this.ConnectionLinesChildren[childConnection]);
        }
        this.ConnectionLinesChildren = [];
    }

    Update(): void {
        for(var i=0; i < this.ParentNodes.length; i++){ // Update the connection lines between this node and its parents and children.
            this.ConnectionLinesParents[i].Target.x = this.ParentNodes[i].RelativeTransform.Position.x;
            this.ConnectionLinesParents[i].Target.y = this.ParentNodes[i].RelativeTransform.Position.y;
        }
        for(var i=0; i < this.ChildNodes.length; i++){
            this.ConnectionLinesChildren[i].Target.x = this.ChildNodes[i].RelativeTransform.Position.x;
            this.ConnectionLinesChildren[i].Target.y = this.ChildNodes[i].RelativeTransform.Position.y;
        }
    }
    // Rendering the stats of this node at the position.
    Render(): void{
        if(!Engine.CanvasContext2D) return;
        var ctx = Engine.CanvasContext2D;
        ctx.fillStyle = `rgb(37, 37, 42)`;
        ctx.fillRect(this.RelativeTransform.Position.x-5, this.RelativeTransform.Position.y-25, 200, 80);
        ctx.font = "14px Helvetica";
        ctx.fillStyle = `rgb(255,255,255)`;
        ctx.fillText(this.ProductName, this.RelativeTransform.Position.x, this.RelativeTransform.Position.y, 150);
        ctx.fillText(`${this.ProductQuantity.toString()}/min`, this.RelativeTransform.Position.x, this.RelativeTransform.Position.y+15, 150);
        if(this.CraftingStation) ctx.fillText(this.CraftingStation, this.RelativeTransform.Position.x, this.RelativeTransform.Position.y+30, 150);
    }
}