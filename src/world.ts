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

export type State = {
    tiles: Arr2<Tile>,
    path: XY[],
    moving: null | number,
    moves: number,
    finalMoves: number,
    modifiers: ("x"|"+")[],
    level: number
}

export function initState(): State {
    const tiles = new Arr2(20, 20, Tile.WALL);

    tiles.fill((x, y) => x > 11 && Math.random() > y / 20 ? Tile.WALL : Tile.EMPTY);

    return {
        tiles,
        path: [
            [0,0],
            [0,1],
            [0,2],
            [1,2],
            [1,1],
            [2,1],
            [3,1],
            [4,1],
            [4,0]
        ],
        moving:null,
        moves: 5,
        finalMoves: 5,
        modifiers: [],
        level: 0
    }
}