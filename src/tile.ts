import { XY } from "./world";

type TileFunction = (pos: XY) => string | null;

export class TileType {

    public readonly getTileBackground: TileFunction;
    public readonly getTileForeground: TileFunction;

    public constructor(
        public readonly solid: boolean,
        background?: string | TileFunction,
        foreground?: string | TileFunction,
        public readonly use?: { name: string }
    ) {
        if (background) {
            this.getTileBackground = typeof background == "string" ? () => background : background;
        }
        if (foreground) {
            this.getTileForeground = typeof foreground == "string" ? () => foreground : foreground;
        }
    }
}

class Tiles {
    readonly EMPTY = new TileType(false, "grass");
    readonly WALL = new TileType(true, "wall");
    readonly FLAG = new TileType(false, "flag", undefined, { name: "finish" });
    readonly DOOR_CLOSED = new TileType(false, "door_closed", undefined, { name: "open" });
    readonly DOOR_OPENED = new TileType(false, "door_opened");
    readonly PLUS = new TileType(false, "plus");
    readonly MULTIPLY = new TileType(false, "multiply");
}

export const TILES = new Tiles();

export type Tile = keyof Tiles;