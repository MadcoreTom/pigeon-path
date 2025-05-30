import { Arr2 } from "./arr2";
import { COLOURS } from "./colours";
import { TileImage } from "./img";
import { getTileName, Tile, TILE_NAMES, TILES } from "./tile";
import { State, XY } from "./world";

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
    grass: [5,0],
    tree1: [5,1],
    tree2: [9,0],
    rockSolid: [6,1],
    rockBroken: [7,1],
    flag1:[6,6],
    flag2:[7,6],
    flag3:[8,6],
    flag4:[9,6],
    plus: [8,1],
    multiply: [9,1],
    arrowRightYellow: [1,5]
});

const smallText = new TileImage("dogica.png", 9, {});

export function render(ctx: CanvasRenderingContext2D, state: State, time: number) {

    if (state.mode.type == "editor") {
        renderEditor(ctx, state, time);
        return;
    }
    if(state.mode.type == "editMenu"){
        renderEditMenu(ctx, state, time);
        return;
    }
    renderTiles(ctx, state.tiles, time);

    state.entities.forEach(e => {
        renderPath(ctx, e.path, time, 12);
        img.draw(ctx, [7, 0], [e.pos[0] * 13, e.pos[1] * 13]);
    })

    if (state.mode.type == "moving") {
        const ai = Math.floor(state.mode.progress);
        const bi = Math.min(state.path.length - 1, ai + 1);
        const u = state.mode.progress - ai;
        const x = state.path[bi][0] * u + state.path[ai][0] * (1 - u);
        const y = state.path[bi][1] * u + state.path[ai][1] * (1 - u);
        img.draw(ctx, [6, 0], [x * 13, y * 13]); // TODO round or floor
    } else {
        renderPath(ctx, state.path, time, state.canMove ? 5 : 0);
        img.draw(ctx, getFrame(time), [state.path[0][0] * 13, state.path[0][1] * 13]);
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

function renderEditor(ctx: CanvasRenderingContext2D, state: State, time: number) {
    if (state.mode.type != "editor") {
        return;
    }
    renderTiles(ctx, state.editor.tiles, time);
    if (time % 1000 < 500) {
        smallText.drawString(ctx, [0, 0], "Editor Mode");
    } else if(state.editor.filename){
        smallText.drawString(ctx, [0, 0], state.editor.filename);
    }
    renderSpeechBubble(ctx, [state.mouse.pos[0], state.mouse.pos[1]], getTileName(state.mouse.scroll));
}

function renderEditMenu(ctx: CanvasRenderingContext2D, state: State, time: number) {
    if (state.mode.type != "editMenu") {
        return;
    }
    ctx.fillStyle = COLOURS.SECONDARY;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const top = state.menu[state.menu.length - 1];
    if (top) {
        top.forEach((opt, i) => {
            smallText.drawString(ctx, [13, i * 13 + 13], opt.name);
        });
        img.drawTile(ctx, [Math.floor(2 - Math.abs(Math.sin(time / 100) * 7)), state.mode.selected * 13 + 10], "arrowRightYellow");
    }
}


function renderTiles(ctx: CanvasRenderingContext2D, tiles: Arr2<Tile>, time: number) {
    ctx.fillStyle = COLOURS.SECONDARY;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // background
    tiles.forEach((x, y, t) => {
        const name = TILES[t].getTileBackground([x, y], time);
        if (name) {
            img.drawTile(ctx, [x * 13, y * 13], name as any)
        }
    });

    // borders
    tiles.forEach((x, y, t) => {
        if (TILES[t].solid) {
            if (!TILES[tiles.get(x - 1, y)].solid) {
                ctx.fillStyle = COLOURS.DARK;
                ctx.fillRect(x * 13, y * 13, 1, 13);
            }
            if (!TILES[tiles.get(x + 1, y)].solid) {
                ctx.fillStyle = COLOURS.DARK;
                ctx.fillRect(x * 13 + 12, y * 13, 1, 13);
            }
            if (!TILES[tiles.get(x, y - 1)].solid) {
                ctx.fillStyle = COLOURS.DARK;
                ctx.fillRect(x * 13, y * 13, 13, 1);
            }
            if (!TILES[tiles.get(x, y + 1)].solid) {
                ctx.fillStyle = COLOURS.DARK;
                ctx.fillRect(x * 13, y * 13 + 12, 13, 1);
            }
        }
    });

    // foreground
    tiles.forEach((x, y, t) => {
        const name = TILES[t].getTileForeground([x, y], time);
        if (name) {
            let ty = y * 13;
            if (TILES[t].jiggle) {
                ty = y * 13 + Math.sin(time / 100 + x + y) * 1.5;
            }
            img.drawTile(ctx, [x * 13, ty], name as any)
        }
    });
}

function getFrame(time: number): XY {
    let x = [0, 0, 0, 1, 2, 3, 3][Math.floor(time / 150) % 7]
    return [6 + x, 5]
}

function renderPath(ctx: CanvasRenderingContext2D, path: XY[], time: number, tileYOffset: number) {
    path.forEach((cur, idx) => {
        if (idx == 0) {
            return;
        }
        const prev = path[Math.max(0, idx - 1)];
        const next = path[Math.min(path.length - 1, idx + 1)];
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

        tile[1] += tileYOffset;


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
    if (state.canMove) {
        img.draw(ctx, [6, 4], [(3 + length + 1) * 13, y], [3, 1]);
    }

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
    const w = Math.max(0, text.length - 1);
    for (let x = 0; x < w; x++) {
        img.drawTile(ctx, [pos[0] + x * 9 + 13, pos[1] - 26], "speech_tm");
        img.drawTile(ctx, [pos[0] + x * 9 + 13, pos[1] - 13], "speech_bm");
    }
    img.drawTile(ctx, [pos[0] + 13 + w * 9, pos[1] - 26], "speech_tr");
    img.drawTile(ctx, [pos[0] + 13 + w * 9, pos[1] - 13], "speech_br");

    smallText.drawString(ctx, [pos[0] + 7, pos[1] - 21], text);
}