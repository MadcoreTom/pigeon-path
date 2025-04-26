import { COLOURS } from "./colours";
import { TileImage } from "./img";
import { initState, State, Tile, XY } from "./world";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const WIDTH = 240;
const HEIGHT = 240;

ctx.fillStyle = COLOURS.SECONDARY;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

const state = initState();

const img = new TileImage("img.png", 13);

function render(state: State) {
    state.tiles.forEach((x, y, t) => {
        switch (t) {
            case Tile.EMPTY:
                ctx.fillStyle = COLOURS.PRIMARY;
                ctx.fillRect(x * 13 + 6, y * 13 + 5, 1, 3);
                ctx.fillRect(x * 13 + 5, y * 13 + 6, 3, 1);
                break;
            case Tile.WALL:
                ctx.fillStyle = COLOURS.PRIMARY;
                ctx.fillRect(x * 13, y * 13, 13, 13);
        }

    });
    img.draw(ctx, [0, 0], [0, 0]);

    // draw path
    state.path.forEach((cur, idx) => {
        const prev = state.path[Math.max(0, idx - 1)];
        const next = state.path[Math.min(state.path.length - 1, idx + 1)];
        const dx1 = prev[0] - cur[0];
        const dx2 = next[0] - cur[0];
        const dy1 = prev[1] - cur[1];
        const dy2 = next[1] - cur[1];
        let tile: XY = [0, 0];
        // arrow tip
        if (cur == next) {
            if (dx1 == 0) {
                tile = dy1 < 0 ? [0, 1] : [0, 0]; // up or down
            } else {
                tile = dx1 < 0 ? [1, 0] : [1, 1]; // right or left
            }
        }
        // horizontal
        else if (dx1 != 0 && dx2 != 0) {
            tile = [2, 1];
        }
        // vertical
        else if (dx1 == 0 && dx2 == 0) {
            tile = [2, 0];
        }
        // left up
        else if ((dx1 < 0 && dy2 < 0) || (dx2 < 0 && dy1 < 0)) {
            tile = [4, 1];
        }
        // right up
        else if ((dx1 > 0 && dy2 < 0) || (dx2 > 0 && dy1 < 0)) {
            tile = [3, 1];
        }
        // left down
        else if ((dx1 < 0 && dy2 > 0) || (dx2 < 0 && dy1 > 0)) {
            tile = [4, 0];
        }
        // right down
        else if ((dx1 > 0 && dy2 > 0) || (dx2 > 0 && dy1 > 0)) {
            tile = [3, 0];
        }

        img.draw(ctx, tile, [cur[0] * 13, cur[1] * 13])
    })

}

function tick(time: number) {
    render(state);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);