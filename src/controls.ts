import { SOUND } from "./sound";
import { State } from "./world";

export enum Controls {
    UP, DOWN, LEFT, RIGHT, CONFIRM, RESET, UNDO
}

const keys: boolean[] = [];

function onKey(key: string, down: boolean) {
    switch (key) {
        case "ArrowUp":
        case "w":
            keys[Controls.UP] = down;
            break;
        case "ArrowDown":
        case "s":
            keys[Controls.DOWN] = down;
            break;
        case "ArrowLeft":
        case "a":
            keys[Controls.LEFT] = down;
            break;
        case "ArrowRight":
        case "d":
            keys[Controls.RIGHT] = down;
            break;
        case "Enter":
        case "z":
        case "e":
            keys[Controls.CONFIRM] = down;
            break;
        case "Backspace":
            keys[Controls.UNDO] = down;
            break;
        case "Escape":
            keys[Controls.RESET] = down;
            break;
    }
    SOUND.resume();
}

export function initKeyboard() {
    window.addEventListener("keydown", e => onKey(e.key, true));
    window.addEventListener("keyup", e => onKey(e.key, false));
}

export function isKeyDown(control: Controls) {
    return !!keys[control];
}

export function isKeyTyped(control: Controls) {
    const tmp = !!keys[control];
    keys[control] = false;
    return tmp;
}

export function initMouse(canvas: HTMLElement, state: State, scale: number = 1) {

    function setMouseButton(evt:MouseEvent, state:State, move:boolean = false){
        state.mouse.clicked ||= (evt.buttons & 0x01) > 0;
        if(!move){
        state.mouse.rightClicked ||= (evt.buttons & 0x04) > 0;
        }
    }

    canvas.addEventListener("mousemove", evt => { state.mouse.pos[0] = evt.offsetX / scale; state.mouse.pos[1] = evt.offsetY / scale ;setMouseButton(evt, state, true)});
    canvas.addEventListener("drag", evt => { state.mouse.pos[0] = evt.offsetX / scale; state.mouse.pos[1] = evt.offsetY / scale; state.mouse.clicked = true; });
    canvas.addEventListener("mousedown", evt => { setMouseButton(evt, state); });
    canvas.addEventListener("wheel",  evt=>{
        state.mouse.scroll += evt.deltaY > 0 ? 1 : -1;
    });
}