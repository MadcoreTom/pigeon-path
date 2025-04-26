import { initKeyboard } from "./controls";
import { render } from "./render";
import { update } from "./update";
import { initState } from "./world";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
initKeyboard();

const state = initState();

function tick(time: number) {
    render(ctx, state);
    update(state);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);