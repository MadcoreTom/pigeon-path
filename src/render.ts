import { COLOURS } from "./colours";
import { TileImage } from "./img";
import { isFinalLength, State, Tile, XY } from "./world";

const WIDTH = 260;
const HEIGHT = 260;
const img = new TileImage("img.png", 13, {
    title: [0, 8, 10, 2],
    blank: [5, 0],
    speech_tl: [0, 10],
    speech_tm: [1, 10],
    speech_tr: [2, 10],
    speech_bl: [0, 11],
    speech_bm: [1, 11],
    speech_br: [2, 11],
});

const smallText = new TileImage("dogica.png", 9, {});

export function render(ctx: CanvasRenderingContext2D, state: State, time: number) {
    renderTiles(ctx, state, time);

    if (state.mode.type == "moving") {
        const ai = Math.floor(state.mode.progress);
        const bi = Math.min(state.path.length - 1, ai + 1);
        const u = state.mode.progress - ai;
        const x = state.path[bi][0] * u + state.path[ai][0] * (1 - u);
        const y = state.path[bi][1] * u + state.path[ai][1] * (1 - u);
        img.draw(ctx, [6, 0], [x * 13, y * 13]); // TODO round or floor
    } else {
        renderPath(ctx, state, time);
    }

    renderHud(ctx, state);

    if (state.mode.type == "transition") {
        ctx.fillStyle = COLOURS.PRIMARY;
        const h = Math.floor(HEIGHT * state.mode.progress);
        ctx.fillRect(0, 0, WIDTH, h);
        img.drawTile(ctx, [13 * 5, Math.floor(Math.min(HEIGHT / 2, h - 13 * 2))], "title");
        img.draw(ctx, [6, 0], [13 * 3.5, Math.floor(Math.min(HEIGHT / 2 + 0.5 * 13, h - 13 * 1.5))])
    }
}

function rnd([x, y]: XY): boolean {
    return Math.floor(x * 3 + y * 2 + x * y + Math.sin(x * 95.0)) % 2 == 0;

}

function renderTiles(ctx: CanvasRenderingContext2D, state: State, time: number) {
    ctx.fillStyle = COLOURS.SECONDARY;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    state.tiles.forEach((x, y, t) => {
        switch (t) {
            case Tile.EMPTY:
                img.drawTile(ctx, [x * 13, y * 13], "blank");
                break;
            case Tile.WALL:
                img.draw(ctx, rnd([x, y]) ? [5, 1] : [9, 0], [x * 13, y * 13]);
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
                img.drawTile(ctx, [x * 13, y * 13], "blank");
                img.draw(ctx, [6 + Math.floor((time / 100) % 4), 6], [x * 13, y * 13]);
                break;
            case Tile.PLUS:
                img.drawTile(ctx, [x * 13, y * 13], "blank");
                img.draw(ctx, [8, 1], [x * 13, y * 13 + Math.sin(time / 100 + x + y) * 1.5]);
                break;
            case Tile.MULTIPLY:
                img.drawTile(ctx, [x * 13, y * 13], "blank");
                img.draw(ctx, [9, 1], [x * 13, y * 13 + Math.sin(time / 100 + x + y) * 1.5]);
                break;
        }

    });
}

function getFrame(time: number): XY {
    let x = [0, 0, 0, 1, 2, 3, 3][Math.floor(time / 150) % 7]
    return [6 + x, 5]
}

function renderPath(ctx: CanvasRenderingContext2D, state: State, time: number) {
    const ready = isFinalLength(state);
    state.path.forEach((cur, idx) => {
        if (idx == 0) {
            img.draw(ctx, getFrame(time), [cur[0] * 13, cur[1] * 13]);
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

        if (ready) {
            tile[1] += 5;
        }

        img.draw(ctx, tile, [cur[0] * 13, cur[1] * 13])
    });

}


function renderHud(ctx: CanvasRenderingContext2D, state: State) {
    ctx.fillStyle = COLOURS.DARK;
    ctx.fillRect(0, HEIGHT - 13 * 2, WIDTH, 13 * 2);

    // Calculated moves
    let y = 18 * 13;
    img.draw(ctx, [0, 4], [0, y], [3, 1])
    let len = renderNumber(ctx, state.moves, [3 * 13, y]);
    if (state.modifiers.length > 0) {
        state.modifiers.forEach((m, x) => {
            const tile: XY = m == "+" ? [8, 3] : [9, 3];
            img.draw(ctx, tile, [(3 + len + x) * 13, y]);
        });
        img.draw(ctx, [7, 3], [(3 + length + state.modifiers.length) * 13, y]);
        renderNumber(ctx, state.finalMoves, [(3 + length + state.modifiers.length + 1) * 13, y]);
    }

    // path
    y += 13;
    img.draw(ctx, [3, 4], [0, y], [3, 1]);
    length = renderNumber(ctx, state.path.length - 1, [3 * 13, 19 * 13]);
    if (isFinalLength(state)) {
        img.draw(ctx, [6, 4], [(3 + length + 1) * 13, y], [3, 1]);
    }

    // level
    img.draw(ctx, [0, 3], [12 * 13, y], [3, 1]);
    length = renderNumber(ctx, state.level + 1, [15 * 13, 19 * 13]);

    // Remaining
    if (state.speechBubble) {
        const end = state.path[state.path.length - 1];
        renderSpeechBubble(ctx, [end[0] * 13 + 8, end[1] * 13 + 2], state.speechBubble);
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

function renderSpeechBubble(ctx: CanvasRenderingContext2D, pos: XY, text: string) {
    img.drawTile(ctx, [pos[0], pos[1] - 26], "speech_tl");
    img.drawTile(ctx, [pos[0], pos[1] - 13], "speech_bl");
    // Variable width
    const w = Math.max(0,text.length-1);
    for (let x = 0; x < w; x++) {
        img.drawTile(ctx, [pos[0] + x *9 + 13, pos[1] - 26], "speech_tm");
        img.drawTile(ctx, [pos[0] + x *9+ 13, pos[1] - 13], "speech_bm");
    }
    img.drawTile(ctx, [pos[0] +13+  w*9, pos[1] - 26], "speech_tr");
    img.drawTile(ctx, [pos[0] +13+  w*9, pos[1] - 13], "speech_br");

    smallText.drawString(ctx, [pos[0] + 7, pos[1] - 21], text);
}