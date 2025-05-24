import { initKeyboard, initMouse } from "./controls";
import { loadLevel } from "./levels";
import { render } from "./render";
import { update } from "./update";
import { initState } from "./world";

const state = initState();

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
initKeyboard();
initMouse(canvas, state, 3);

loadLevel(state, state.level)

let lastFrameTime = 0;
const MAX_FRAME_TIME = 100;

function tick(time: number) {
    const delta = Math.min(MAX_FRAME_TIME, time - lastFrameTime);
    lastFrameTime = time;
    render(ctx, state, time);
    update(state, delta);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);