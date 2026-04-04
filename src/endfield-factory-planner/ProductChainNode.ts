import { GameObject } from "../game-engine/GameObject";

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
}