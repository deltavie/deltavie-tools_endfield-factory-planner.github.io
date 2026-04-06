export enum MouseButtons {
    MOUSE1,
    MOUSE2
}

export class Mouse{ // Mouse object.
    x: number = 0;
    y: number = 0;
    Buttons: {[key: number]: boolean} = {};
    
    constructor(){
        for(let button in MouseButtons){
            this.Buttons[button] = false;
        }
    }
}