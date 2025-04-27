import { SOUND } from "./sound";

export enum Controls {
    UP, DOWN, LEFT, RIGHT, CONFIRM, BACK
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