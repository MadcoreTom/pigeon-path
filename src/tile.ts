import { XY } from "./world";

type TileFunction = (pos: XY, time: number) => string | null;


function animTileFunction(rate: number, frames: string[]): TileFunction {
    const len = frames.length;
    return (xy, time) => {
        const i = Math.floor((time / rate * len) % len);
        return frames[i];
    }
}

function checkerboardTileFunction(a: string, b: string): TileFunction {
    return ([x, y]) => (x + y) % 2 < 1 ? a : b;
}

export class TileType {

    public readonly getTileBackground: TileFunction;
    public readonly getTileForeground: TileFunction;
    public jiggle: boolean = false;

    public constructor(
        public readonly solid: boolean,
        background?: string | TileFunction,
        foreground?: string | TileFunction,
        public readonly use?: { name: string }
    ) {
        if (background) {
            this.getTileBackground = typeof background == "string" ? () => background : background;
        } else {
            this.getTileBackground = () => null;
        }
        if (foreground) {
            this.getTileForeground = typeof foreground == "string" ? () => foreground : foreground;
        } else {
            this.getTileForeground = () => null;
        }
    }
}

class Tiles {
    readonly EMPTY = new TileType(false, "grass");
    readonly WALL = new TileType(true, checkerboardTileFunction("tree1", "tree2"));
    readonly FLAG = new TileType(false, "grass", animTileFunction(300, ["flag1", "flag1", "flag1", "flag2", "flag3", "flag4"]), { name: "finish" });
    readonly DOOR_CLOSED = new TileType(false, "rockSolid", undefined, { name: "open" });
    readonly DOOR_OPENED = new TileType(false, "rockBroken");
    readonly PLUS = new TileType(false, "grass", "plus");
    readonly MULTIPLY = new TileType(false, "grass", "multiply");
    readonly WATER = new TileType(true, animTileFunction(600, ["water3", "water2", "water1"]));
    readonly SAND = new TileType(false, "sand");
    readonly CACTUS = new TileType(true, checkerboardTileFunction("cactus1", "cactus2"));
    readonly STONE_WALL = new TileType(true, checkerboardTileFunction("stoneWall1","stoneWall2"));
    readonly CRATE_CLOSED = new TileType(false, "crate", undefined, { name: "open" });
    readonly CRATE_OPENED = new TileType(false, "crateBroken");
}

export const TILES = new Tiles();
TILES.PLUS.jiggle = true;
TILES.MULTIPLY.jiggle = true;

export type Tile = keyof Tiles;

export const TILE_NAMES = Object.keys(TILES) as Tile[];

export function getTileName(idx: number): Tile {
    const i = (TILE_NAMES.length + (idx % TILE_NAMES.length)) % TILE_NAMES.length;
    return TILE_NAMES[i];
}
