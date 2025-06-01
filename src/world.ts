import { Arr2 } from "./arr2"
import { Tile } from "./tile";

export type XY = [number, number];

export type Mode = { type: "play" } |
{ type: "moving", progress: number } |
{ type: "transition", direction: "up" | "down", progress: number, levelDelta: number } |
{ type: "entities", time: number } |
{ type: "editor", tile: Tile } |
{ type: "editMenu", selected: number } 

export type MenuItem = {
    name: string,
    onClick: (state:State)=>void
}

export type Entity = {
    type: "vertical",
    down: boolean,
    pos: XY,
    path: XY[]
}

export type State = {
    tiles: Arr2<Tile>,
    path: XY[],
    mode: Mode,
    moves: number,
    finalMoves: number,
    modifiers: ("x" | "+")[],
    level: number,
    speechBubble: string | null,
    entities: Entity[],
    canMove: boolean,
    editor: {
        tiles: Arr2<Tile>,
        filename: string | null,
        spawn: XY,
        mode: "tile"|"entity"
    },
    mouse: {
        pos: XY,
        clicked: boolean,
        rightClicked: boolean,
        scroll: number
    },
    menu: MenuItem[][],
    testing: boolean
}

export function initState(): State {
    const tiles = new Arr2<Tile>(20, 18, "WALL");
    tiles.fill((x, y) => x > 11 && Math.random() > y / 20 ? "WALL" : "EMPTY");

    const editor = new Arr2<Tile>(20, 18, "WALL");
    editor.fill((x, y) => x > 11 && Math.random() > y / 20 ? "WALL" : "EMPTY");

    return {
        tiles,
        path: [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 2],
            [1, 1],
            [2, 1],
            [3, 1],
            [4, 1],
            [4, 0]
        ],
        // mode: { type: "transition", direction: "up", progress: 2, levelDelta: 0 },
        mode: { type: "editor", tile: "WALL" },
        testing: true,
        moves: 4,
        finalMoves: 4,
        modifiers: [],
        level: 0,
        speechBubble: null,
        entities: [],
        canMove: false,
        editor: {
            tiles: editor,
            filename: null,
            spawn: [5,5],
            mode:"tile"
        },
        mouse: {
            pos: [0, 0],
            clicked: false,
            rightClicked: false,
            scroll: 0
        },
        menu: []
    }
}



export function isFinalLength(state: State): boolean {
    return state.path.length - 1 == state.finalMoves;
}

export function isSecondFinalLength(state: State): boolean {
    return state.path.length - 1 == state.finalMoves - 1;
}
