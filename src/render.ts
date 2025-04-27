import { COLOURS } from "./colours";
import { TileImage } from "./img";
import { State, Tile, XY } from "./world";

const WIDTH = 260;
const HEIGHT = 260;
const img = new TileImage("img.png", 13);

export function render(ctx: CanvasRenderingContext2D, state: State, time: number) {
    renderTiles(ctx, state, time);

    if (state.moving) {
        const ai = Math.floor(state.moving);
        const bi = Math.min(state.path.length - 1, ai + 1);
        const u = state.moving - ai;
        const x = state.path[bi][0] * u + state.path[ai][0] * (1 - u);
        const y = state.path[bi][1] * u + state.path[ai][1] * (1 - u);
        img.draw(ctx, [6, 0], [x * 13, y * 13]); // TODO round or floor
    } else {
        renderPath(ctx, state);
    }

    renderHud(ctx, state)
}

function renderTiles(ctx: CanvasRenderingContext2D, state: State, time: number) {
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
                img.draw(ctx, [5, 1], [x * 13, y * 13]);
                // borders
                if (state.tiles.get(x - 1, y) != Tile.WALL) {
                    ctx.fillStyle = COLOURS.DARK;
                    ctx.fillRect(x * 13, y * 13, 1, 13);
                }
                if (state.tiles.get(x + 1, y) != Tile.WALL) {
                    ctx.fillStyle = COLOURS.DARK;
                    ctx.fillRect(x * 13 + 12, y * 13, 1, 13);
                }
                if (state.tiles.get(x, y - 1) != Tile.WALL) {
                    ctx.fillStyle = COLOURS.DARK;
                    ctx.fillRect(x * 13, y * 13, 13, 1);
                }
                if (state.tiles.get(x, y + 1) != Tile.WALL) {
                    ctx.fillStyle = COLOURS.DARK;
                    ctx.fillRect(x * 13, y * 13 + 12, 13, 1);
                }
                break;
            case Tile.DOOR_CLOSED:
                img.draw(ctx, [6, 1], [x * 13, y * 13]);
                break;
            case Tile.DOOR_OPENED:
                img.draw(ctx, [7, 1], [x * 13, y * 13]);
                break;
            case Tile.FLAG:
                img.draw(ctx, [8, 0], [x * 13, y * 13]);
                break;
            case Tile.PLUS:
                img.draw(ctx, [8, 1], [x * 13, y * 13 + Math.sin(time / 100 + x + y) * 1.5]);
                break;
            case Tile.MULTIPLY:
                img.draw(ctx, [9, 1], [x * 13, y * 13 + Math.sin(time / 100 + x + y) * 1.5]);
                break;
        }

    });
}

function renderPath(ctx: CanvasRenderingContext2D, state: State) {
    const ready = state.path.length == state.finalMoves;
    state.path.forEach((cur, idx) => {
        if (idx == 0) {
            img.draw(ctx, [6, 0], [cur[0] * 13, cur[1] * 13]);
            return;
        }
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

        if(ready){
            tile[1]+=5;
        }

        img.draw(ctx, tile, [cur[0] * 13, cur[1] * 13])
    });

}


function renderHud(ctx: CanvasRenderingContext2D, state: State) {
    ctx.fillStyle = COLOURS.DARK;
    ctx.fillRect(0, HEIGHT - 13 * 2, WIDTH, 13 * 2);

    // Calculated moves
    let y = 18 * 13;
    img.draw(ctx,[0,4],[0,y],[3,1])
    let len = renderNumber(ctx, state.moves, [3 * 13, y]);
    if(state.modifiers.length > 0){
        state.modifiers.forEach((m, x) => {
            const tile: XY = m == "+" ? [8, 3] : [9, 3];
            img.draw(ctx, tile, [(3 + len + x) * 13, y]);
        });
        img.draw(ctx, [7, 3], [(3 + length + state.modifiers.length ) * 13, y]);
        renderNumber(ctx, state.finalMoves, [(3 + length + state.modifiers.length + 1) * 13, y]);
    }

    y += 13;
    img.draw(ctx,[3,4],[0,y],[3,1]);
    length = renderNumber(ctx, state.path.length, [3 * 13, 19 * 13]);
    if(state.finalMoves == state.path.length){
        img.draw(ctx,[6,4],[(3 + length + 1)*13,y],[3,1]);
    }
}


function renderNumber(ctx: CanvasRenderingContext2D, num: number, pos: XY): number {
    const chars = ("" + Math.floor(num)).split("");

    const offset = "0".charCodeAt(0);
    chars.forEach((char, x) => {
        img.draw(ctx, [char.charCodeAt(0) - offset, 2], [pos[0] + x * 13, pos[1]]);
    });
    return chars.length;
}