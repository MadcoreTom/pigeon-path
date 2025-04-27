import { initKeyboard } from "./controls";
import { loadLevel } from "./levels";
import { render } from "./render";
import { update } from "./update";
import { initState } from "./world";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
initKeyboard();

const state = initState();
loadLevel(state,"LEVEL1")

function tick(time: number) {
    render(ctx, state, time);
    update(state);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);