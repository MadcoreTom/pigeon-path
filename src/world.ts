import { Arr2 } from "./arr2"

export enum Tile {
    EMPTY,
    WALL,
    FLAG,
    DOOR_CLOSED,
    DOOR_OPENED,
    PLUS,
    MULTIPLY
}

export type XY = [number, number];

export type Mode = { type: "play" } | { type: "moving", progress: number } | { type: "transition", direction: "up" | "down", progress: number, levelDelta: number }

export type State = {
    tiles: Arr2<Tile>,
    path: XY[],
    mode: Mode,
    moves: number,
    finalMoves: number,
    modifiers: ("x" | "+")[],
    level: number
}

export function initState(): State {
    const tiles = new Arr2(20, 20, Tile.WALL);

    tiles.fill((x, y) => x > 11 && Math.random() > y / 20 ? Tile.WALL : Tile.EMPTY);

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
        mode: { type: "transition", direction: "up", progress: 2, levelDelta: 0 },
        moves: 5,
        finalMoves: 5,
        modifiers: [],
        level: 0
    }
}