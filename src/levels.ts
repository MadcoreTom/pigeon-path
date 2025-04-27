import { State, Tile } from "./world"

const LEVEL1 = `
####################
####..........######
####.s.....#.#.#####
####............####
####...x...#.#..####
####............####
####...x........####
####............####
####......###...####
####......###...####
####............####
########^###########
######.....#.....###
######.....#.....###
######..+..^..!..###
######.....#.....###
######.....#.....###
####################
`

const LEVELS = {
    LEVEL1
}

const CHAR_MAP:{[id:string]:Tile}={
    "#": Tile.WALL,
    ".": Tile.EMPTY,
    "^": Tile.DOOR_CLOSED,
    "!": Tile.FLAG,
    "x": Tile.MULTIPLY,
    "+": Tile.PLUS
}

export function loadLevel(state:State, levelName: string){
    const level = LEVELS[levelName];
    if(level){
        const lines = level.split(/[\r\n]+/).map(a=>a.trim()).filter(a=>a.length > 0);
        lines.forEach((line,y)=>{
            line.split("").forEach((char,x)=>{
                state.tiles.set(x,y,CHAR_MAP[char] | Tile.EMPTY);
                if(char == "s"){
                    state.path = [[x,y]]
                }
            })
        })
    }
}