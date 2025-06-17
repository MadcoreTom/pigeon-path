import { Arr2 } from "./arr2"
import { Tile } from "./tile"
import { Entity, State, XY } from "./world"


// Learn that you move 4 steps
const L1 = `
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwww##wwwwwwwwwwww
wwwww####wwwwwwwwwww
wwwww#....!wwwwwwwww
wwwwww.....wwwwwwwww
wwwwww....:wwwwwwwww
wwwwww...::wwwwwwwww
wwwwwws.:::wwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww`;

// Learn about +1
const L2= `
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwww&&&wwwwwwwww
wwwwwwww&:&wwwwwwwww
wwwww...&&&+..!#wwww
wwwww.s......###wwww
wwwww...&&&&w###wwww
wwwwwwww&::&wwwwwwww
wwwwwwww&::&wwwwwwww
wwwwwwww&&&&wwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
`;

// learn about x2
const L3 = `
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwx....wwwwww
wwwwwwwww.###.wwwwww
wwwwwwwww.###.wwwwww
wwwwwwwww.###.wwwwww
wwwwwwwwwx###!wwwwww
wwwwwwwww.####wwwwww
wwwwwwwww.####.wwwww
wwwwwwwww.####.wwwww
wwwwwwwwws####.wwwww
wwwwwwwww......wwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww`

// learn about doors
const L4 = `
wwwwwwwwwwwwwwwwwwww
www##......wwwwwwwww
w####...##.wwwwwwwww
w##.....##.wwwwwwwww
w###.......wwwwwwwww
w##s.......wwwwwwwww
w####.....##wwwwwwww
w#...x.....##wwwwwww
w#....&&]&&##wwwwwww
w##...&:::&Cwwwwwwww
ww&&&&&:::&Cwwwwwwww
ww:::C&&[&&.wwwwwwww
wwww:....:::wwwwwwww
wwww.......:wwwwwwww
wwwwww.......owwwwww
wwwwwwww.....!wwwwww
wwwwwwwwwww#..wwwwww
wwwwwwwwwwwwwwwwwwww`;

// learn about vertical enemies
const L5 = `
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
ww:::.......::::::ww
ww::........::::::ww
ww:::.......::::::ww
ww::....#...::::::ww
ww:::.....#.::::::ww
ww::.#......:::{::ww
ww:::.......:{::..ww
ww:s...#....::::.!ww
ww:::.......::::..ww
ww::.....#..::::{:ww
ww:::.#....#::::::ww
ww::........::{:::ww
ww:::.......::::::ww
ww::........::::::ww
wwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwww
"vertical",5,8
"vertical",6,7
"vertical",7,11
"vertical",8,7
"vertical",9,4
"vertical",10,10
"vertical",11,6
"vertical",13,10
"vertical",14,6
"vertical",15,10
"vertical",16,4`

const ISLAND = `
wwwwwwwwwwwwwwwwwwww
wwwwwwww....#wwwwwww
wwwww##.....#.#wwwww
www.......&&&&&#wwww
ww...#....&...&##www
ww..........!.&##^ww
w....+..::&...&##^ww
w.....::::&&&&&^#^ww
w##..::::wwwwwwwwwww
w^^..:::wwwwwwwwwwww
w^^..::::wwwwww^^www
ww.....:::.....^^www
ww...##....#.###^www
ww::..^^#.s...^^^www
www::.^^#....##^^www
wwww::........##wwww
wwwww::::::::.wwwwww
wwwwwwwwwwwwwwwwwwww`

const LEVEL_FLAG = `
####################
####################
####################
####################
########.###########
#######.s..#########
########.####..#####
########.####..#####
########.###########
########.###########
########.####...####
########......!.####
#############...####
####################
##....##############
##....##############
##....##############
####################
`


const LEVEL_PLUS_1 = `
####################
####################
####################
####################
####################
####################
####............####
####............####
####.s..#+#...!.####
####............####
####............####
####################
####################
####################
####################
####################
####################
####################
`

const LEVEL_MULT_2 = `
####################
####################
####################
####s###############
####.###############
####.###############
####x###############
####.######......###
####.######x####.###
####.######.####.###
####.x......####.###
################.###
################.###
######...#######.###
######.!.........###
######...###########
####################
####################
`

const LEVEL_PLUS_MULT = `
####################
####################
####################
####################
####################
####################
####################
####################
###s.x.......#######
########+#...#######
########.....#######
########.....#######
########.....#######
####################
####################
####################
####################
####################
`


const LEVEL_ENEMY = `
####################
######.#############
######..############
######...###########
######....##########
######.....#########
######.....#########
##...#.....#####...#
##.s.............!.#
##...#AAAAA#####...#
####################
####################
####################
####################
####################
####################
####################
####################
`

const LEVEL1 = `
####################
####################
####################
####################
####################
####################
####################
#####.....#....#####
#####.s...^....#####
#####.....#....#####
##############x#####
###!.#########.#####
####.###++.###A#####
####.++^.#.^...#####
########...#########
####################
####################
####################
`

const LEVEL2 = `
####################
####.......#########
####.s.....###.#####
####.......^x...####
####...x...#....####
#####......###^#####
#####..........A####
####............####
####......###...####
####A.+...###...####
####............####
########^###########
######.....#.....###
######.....#.....###
######.A+..^..!.+###
######.....#.....###
######.....#.....###
####################
`

const LEVEL3 = `
####################
#...............x.##
#+#.......!.....#.##
#+#.###########.#.##
#+#..^........^.#..#
#+########^#######.#
#+^..............^.#
#.###.##....##.###.#
#...^.#......#.^...#
###.#.#..s...#.#####
#...#.########.#..x#
#.#.#..........#.#.#
#.#.#..#######.#.#.#
#.#.^..#.....#.^.#.#
#.#.#....#.#...#.#.#
#.#.######.#####.#.#
#......^..........x#
####################
`

const LEVEL4 = `
####################
####################
#...............x..#
#^##.#####.####.##+#
#+##.#####.####^##+#
#.##x#####!####.##+#
#.##.##########.##.#
#+##x##########.##.#
#.##.##########.##.#
#.##.##########.##.#
#.##x##########.##.#
#+##.##########.##.#
#.##.##########.##.#
#.##.##########.##.#
#+##.###....###.##.#
#......x..s.x......#
########....########
####################
`


const LEVEL5 = `
####################
#..................#
#.!.......!........#
#..................#
#.....!.......!....#
#..................#
#..................#
####^#########^#####
####^#########^#####
####^#########^#####
#..+...........+...#
#..................#
#..................#
#........s.........#
#..................#
#..................#
#..................#
####################
`

const LEVEL6 = `
####################
####################
####################
####################
####################
####################
####################
####.+.#####.x.#####
#s.+.#.......#....!#
####.x.#####.+.#####
####################
####################
####################
####################
####################
####################
####################
####################
`

const END = `
####################
#.###.#...##.#.#####
##.#.##.#.##.#.#####
###.###.#.##.#.#####
###.###.s.##...#####
#################.##
#.#.#.##.##.##.##.##
#.#.#.##.##..#.##.##
#.#.#.##.##.#..#####
#.....##.##.##.##+##
####################
####################
####################
####################
####################
####################
####################
####################
`


const LOOPS = `
####################
#########s##########
#########x##########
#########.##########
#########.##########
#########.##########
########++.#########
#######+++++########
######+.+++++#######
######++++.++#######
######+.+++++#######
######++++++.#######
#########.##########
#########!##########
####################
####################
####################
####################
`

const ROOMS = `
####################
#......#############
#..s...#############
#....+.^...^......##
#......#####......##
####^#######......##
####x#######......##
####.#######......##
####^#########^#####
###.............####
###.+...........####
###.............####
###########....#####
#.....#.+.#....#####
#..!..^.#.^....#####
#.....#+.+#....#####
#.....##############
####################
`

const LEVELS = [
    L1, 
    L2, L3, L4,
    L5,
    // ISLAND,
    // LEVEL_MULT_2,
    // // LEVEL_ENEMY,
    // //    LEVEL1, LEVEL2, ROOMS,LOOPS, LEVEL4, LEVEL5, LEVEL6, 
    // //    LEVEL7,
    // LEVEL3, END
]

const CHAR_MAP: { [id: string]: Tile } = {
    "#": "WALL",
    ".": "EMPTY",
    "^": "DOOR_CLOSED",
    "o": "DOOR_OPENED",
    "!": "FLAG",
    "x": "MULTIPLY",
    "+": "PLUS",
    "w": "WATER",
    ":": "SAND",
    "&": "STONE_WALL",
    "C": "CRATE_CLOSED",
    "c": "CRATE_OPENED",
    "{": "CACTUS",
    "[": "STONE_DOORWAY",
    "]": "STONE_DOOR"
}

const REVRSE_CHAR_MAP = Object.entries(CHAR_MAP).reduce((acc, [v, k]) => { acc[k] = v; return acc }, {});
console.log(REVRSE_CHAR_MAP);


type EntitySerializer = {
    toEntity:(args:any[])=>Entity,
    toArgs:(entity:Entity)=>any[]
}

const ENTITY_SERIALIZERS:{[type:string]:EntitySerializer} = {
    "vertical":{
        toEntity: args => ({type:"vertical", pos:[parseInt(args[1]),parseInt(args[2])], down: true, path:[[parseInt(args[1]),parseInt(args[2])]]}),
        toArgs: ent=> ["vertical", ent.pos[0], ent.pos[1]]
    }
}

export function loadLevel(state: State, levelNum: number) {
    const level = LEVELS[levelNum % LEVELS.length];
    state.entities = [];
    if (level) {
        loadTiles(
            level,
            state.tiles,
            (char, [x, y]) => {
                if (char == "s") {
                    // start
                    state.path = [[x, y]]
                }
                if (char == "A") {
                    // enemy a
                    state.entities.push({
                        type: "vertical",
                        down: true,
                        path: [[x, y]],
                        pos: [x, y]
                    });
                }
                return "EMPTY";
            },
            args=>{
                const ent = ENTITY_SERIALIZERS[args[0]].toEntity(args);
                ent && state.entities.push(ent);
            }
        );
    }
}

const LEVEL_ROWS = 18;

function loadTiles(data: string, tiles: Arr2<Tile>, handler: (c: string, xy: XY) => Tile, entityHandler: (args:any[]) => void) {
    const lines = data.split(/[\r\n]+/).map(a => a.trim()).filter(a => a.length > 0);
    lines.forEach((line, y) => {
        if (y <= LEVEL_ROWS) {
            line.split("").forEach((char, x) => {
                const t = CHAR_MAP[char];
                if (t) {
                    tiles.set(x, y, t);
                } else {
                    tiles.set(x, y, handler(char, [x, y]));
                }
            });
        } else {
            const parts = JSON.parse(`[${line}]`);
            if(parts.length > 2){
                entityHandler(parts);
            }
        }
    });
}

export function serializeEditor(state: State): string {
    let str = "";
    for (let row = 0; row < state.editor.tiles.height; row++) {
        for (let col = 0; col < state.editor.tiles.width; col++) {
            const t = state.editor.tiles.get(col, row);
            if (row > 0 && col == 0) {
                str += "\n";
            }
            if (row == state.editor.spawn[1] && col == state.editor.spawn[0]) {
                str += "s";
            } else {
                str += REVRSE_CHAR_MAP[t];
            }
        }
    }
    for (let ent of state.editor.entities) {
        const args = JSON.stringify(ENTITY_SERIALIZERS[ent.type].toArgs(ent));
        str += "\n" + args.substring(1, args.length - 1);
    }
    return str;
}


export function deserializeEditor(data: string, state: State) {
    loadTiles(
        data,
        state.editor.tiles,
        (char, [x, y]) => {
            if (char == "s") {
                // start
                state.path = [[x, y]];
                state.editor.spawn = [x,y]
            } else {
            console.log("Ignoring char", char)

            }
            // if (char == "A") {
            //     // enemy a
            //     state.entities.push({
            //         type: "vertical",
            //         down: true,
            //         path: [[x, y]],
            //         pos: [x, y]
            //     });
            // }
            return "EMPTY";
        },
        args=>{
            const ent = ENTITY_SERIALIZERS[args[0]].toEntity(args);
            ent && state.editor.entities.push(ent);
        }
    );
}