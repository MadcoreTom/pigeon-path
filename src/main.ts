import { COLOURS } from "./colours";
import { Controls, initKeyboard, isKeyTyped } from "./controls";
import { TileImage } from "./img";
import { initState, State, Tile, XY } from "./world";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
initKeyboard();

const WIDTH = 260;
const HEIGHT = 260;

const state = initState();

const img = new TileImage("img.png", 13);

function render(state: State) {

    ctx.fillStyle = COLOURS.SECONDARY;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

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
    });


    /// Draw length
    ctx.fillStyle =COLOURS.LIGHT;
    ctx.fillText(""+state.path.length,2,100)

}

function tick(time: number) {
    render(state);
    let movement :null | XY = null;
    if(isKeyTyped(Controls.UP)){
        movement = [0,-1];
    }
    if(isKeyTyped(Controls.LEFT)){
        movement = [-1,0];
    }
    if(isKeyTyped(Controls.DOWN)){
        movement = [0,1];
    }
    if(isKeyTyped(Controls.RIGHT)){
        movement = [1,0];
    }

    if (movement) {
        const end = state.path[state.path.length - 1];
        const secondEnd = state.path[state.path.length - 2];
        const newPos: XY = [end[0] + movement[0], end[1] + movement[1]];

        if (secondEnd && secondEnd[0] == newPos[0] && secondEnd[1] == newPos[1]) {
            state.path.pop();
        } else {
            const collides = state.tiles.get(newPos[0],newPos[1]) == Tile.WALL;
            if(!collides){
                state.path.push(newPos);
            }
        }
    }
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);