import { Controls, isKeyTyped } from "./controls";
import { loadLevel } from "./levels";
import { addFile, listFiles } from "./localStorage";
import { getMenuItem } from "./menu";
import { SOUND } from "./sound";
import { getTileName, TILES } from "./tile";
import { isFinalLength, isSecondFinalLength, State, XY } from "./world";

export function update(state: State, delta: number) {
    if(state.mode.type == "editor"){
        updateEditor(state);
    }
    if(state.mode.type == "editMenu"){
        // TODO move to its own update
        let delta= 0;
        if (isKeyTyped(Controls.UP)) {
            delta = -1;
        }
        if (isKeyTyped(Controls.DOWN)) {
            delta = 1;
        }
        state.mode.selected += delta;
        if(delta == 0 && isKeyTyped(Controls.CONFIRM)){
            const top = state.menu[state.menu.length-1];
            if(top){
                const sel = top[state.mode.selected];
                if(sel){
                    sel.onClick(state);
                }
            }
        }
    }
    if (state.mode.type == "play") {
        let movement: null | XY = null;
        if (isKeyTyped(Controls.UP)) {
            movement = [0, -1];
        }
        if (isKeyTyped(Controls.LEFT)) {
            movement = [-1, 0];
        }
        if (isKeyTyped(Controls.DOWN)) {
            movement = [0, 1];
        }
        if (isKeyTyped(Controls.RIGHT)) {
            movement = [1, 0];
        }

        if (movement) {
            const end = state.path[state.path.length - 1];
            const secondEnd = state.path[state.path.length - 2];
            const newPos: XY = [end[0] + movement[0], end[1] + movement[1]];

            if (secondEnd && secondEnd[0] == newPos[0] && secondEnd[1] == newPos[1]) {
                // Backwards
                state.path.pop();
                SOUND.retreat();
            } else if (isFinalLength(state)) {
                // Max length
                SOUND.collide();
            } else {
                // push
                let collides = TILES[state.tiles.get(newPos[0], newPos[1])].solid;
                collides ||= state.entities.filter(e=>e.pos[0] == newPos[0] && e.pos[1] == newPos[1]).length > 0;
                collides ||= state.path.filter(p=>p[0]==newPos[0] && p[1] == newPos[1]).length > 0;
                if (!collides) {
                    const t = state.tiles.get(newPos[0], newPos[1]);
                    const needsToFinishOnThisTile = !!TILES[t].use;
                    if (needsToFinishOnThisTile && !isSecondFinalLength(state)) {
                        SOUND.doorLocked();
                    } else {
                        state.path.push(newPos);
                        SOUND.move();
                    }
                } else {
                    SOUND.collide();
                }
            }
        }
        if (isKeyTyped(Controls.CONFIRM)) {
            if (state.canMove) {
                state.mode = { type: "moving", progress: 0 };
                SOUND.openDoor();
            } else {
                SOUND.collide();
            }
        }
        if (isKeyTyped(Controls.UNDO)) {
            state.path = [state.path[0]];
            SOUND.retreat();
        }

        // speech bubble text
        state.canMove = false;
        if (state.path.length == 1) {
            state.speechBubble = "Move";
        } else if (state.finalMoves + 1 - state.path.length > 0) {
            state.speechBubble = "" + (state.finalMoves + 1 - state.path.length);
        } else {
            const end = state.path[state.path.length - 1];
            const t = state.tiles.get(end[0], end[1]);
            // true if the end position is any positions of the paths of any entities
            const badStop = state.entities.filter(e => e.path.filter(p => p[0] == end[0] && p[1] == end[1]).length > 0).length > 0;
            if (badStop) {
                state.speechBubble = "Can't move here!";
            }  else if (t == "FLAG") {
                state.speechBubble = TILES[t].use?.name || null;
                state.canMove = true;
            } else if (TILES[t].use) {
                state.speechBubble = TILES[t].use?.name || null;
                state.canMove = true;
            }else {
                state.speechBubble = "Go!"
                state.canMove = true;
            }
        }
    } else if (state.mode.type == "moving") {
        state.speechBubble = null;
        // moving
        state.mode.progress += delta * 0.01;
        if (state.mode.progress >= state.path.length) {
            state.mode = { type: "entities", time: 0 };
            const end = state.path[state.path.length - 1];
            state.path = [end];
            const tile = state.tiles.get(end[0], end[1]);
             if (tile == "FLAG") {
                SOUND.newLevel();
                state.mode = { type: "transition", progress: 0, direction: "down", levelDelta: 1 };
            } else if (TILES[tile].use) {
                 SOUND.openDoor();
                 if (TILES[tile].use.newTile) {
                     state.tiles.set(end[0], end[1], TILES[tile].use.newTile);
                 } else {
                     state.tiles.set(end[0], end[1], "DOOR_OPENED");
                 }
            } 
        }
    } else if (state.mode.type == "entities") {
        let step = false;
        state.mode.time += delta / 200;
        if (state.mode.time >= 1) {
            state.mode.time -= 1;
            step = true;
            console.log("step")
        }
        let finished = true;
        state.entities.forEach(e => {
            if (step && e.path.length > 0) {
                e.path.shift();
            }
            if (e.path.length > 1 && state.mode.type == "entities") {
                const v = 1 - state.mode.time;
                const i = 1;
                e.pos[0] = state.mode.time * e.path[i][0] + v * e.path[i - 1][0];
                e.pos[1] = state.mode.time * e.path[i][1] + v * e.path[i - 1][1];
                finished = false;
            }
        })
        if (finished) {
            console.log("finished");
            // calculate path here
            calcEntityPath(state);
            state.mode = { type: "play" };
        }
    } else if (state.mode.type == "transition") {
        state.speechBubble = null;
        if (state.mode.direction == "down") {
            state.mode.progress += delta * 0.003;
            if (state.mode.progress > 1.5) {
                state.mode.progress = 1;
                state.mode.direction = "up";
                state.level += state.mode.levelDelta;
                if (state.testing) {
                    console.log("Load testing");
                    state.editor.tiles.forEach((x, y, t) => {
                        state.tiles.set(x, y, t);
                    });
                } else {
                    console.log("Load normal")
                    loadLevel(state, state.level);
                }
            }
        } else {
            state.mode.progress -= delta * 0.003;
            if (state.mode.progress < 0) {
                state.mode = { type: "play" }
                calcEntityPath(state);
            }

        }
    }

    calcMoves(state);
    if (isKeyTyped(Controls.RESET)) {
        if (state.mode.type == "play" || state.mode.type == "moving") {
            if (state.testing) {
                state.mode = { type: "editor", tile: "EMPTY" };
            } else {
                state.mode = { type: "transition", progress: 0, direction: "down", levelDelta: 0 };
            }
        } else if (state.mode.type == "editor") {
            state.mode = { type: "editMenu", selected: 0 }
            state.menu = [getMenuItem()];
        }
    }

    if(state.mode.type == "editor" && isKeyTyped(Controls.CONFIRM) ){
        state.editor.mode = state.editor.mode == "entity" ? "tile" : "entity";
    }
}

function calcEntityPath(state: State) {
    state.entities.forEach(e => {
        e.pos[0] = e.path[0][0];
        e.pos[1] = e.path[0][1];
        if (e.type == "vertical") {
            for (let i = 0, tries = 0; i < 3 && tries < 10; i++, tries++) {
                const end = e.path[e.path.length - 1];
                const up = TILES[state.tiles.get(end[0], end[1] - 1)];
                const down = TILES[state.tiles.get(end[0], end[1] + 1)];
                if (e.down) {
                    if (!down.solid && !down.use) {
                        e.path.push([end[0], end[1] + 1]);
                    } else {
                        e.down = false;
                        i--;
                    }
                } else if (!e.down) {
                     if (!up.solid && !up.use) {
                        e.path.push([end[0], end[1] - 1]);
                    } else {
                        e.down = true;
                        i--;
                    }
                }
            }
        }
    })
}

function calcMoves(state: State) {
    state.modifiers = [];
    state.path.forEach(p => {
        const t = state.tiles.get(p[0], p[1]);
        if (t == "MULTIPLY") {
            state.modifiers.push("x")
        } else if (t == "PLUS") {
            state.modifiers.push("+")
        }
    })
    let m = state.moves;
    state.modifiers.forEach(x => {
        if (x == "+") {
            m++;
        } else {
            m *= 2;
        }
    });
    state.finalMoves = m;
}

function updateEditor(state: State) {
    if (state.mouse.clicked) {
        state.mouse.clicked = false;
        if (state.mode.type == "editor") {
            const tx = Math.floor(state.mouse.pos[0] / 13);
            const ty = Math.floor(state.mouse.pos[1] / 13);
            if(state.editor.mode == "tile"){
            if (state.editor.tiles.inRange(tx, ty)) {
                state.editor.tiles.set(tx, ty, getTileName(state.mouse.scroll));
            }
            } else if(state.editor.mode == "entity"){
                switch(state.mouse.scroll % 2){
                    case 0:
                        state.editor.spawn = [tx,ty]
                        break;
                    case 1:
                        let cur = state.editor.entities.filter(e=>e.pos[0] == tx && e.pos[1] == ty)[0];
                        if(cur){
                            // remove
                            state.editor.entities = state.editor.entities.filter(e=>!(e.pos[0] == tx && e.pos[1] == ty));
                        } else {
                            state.editor.entities.push({ type:"vertical", pos:[tx,ty], down:true, path:[]})
                        }
                }
            }
        }
    }
    if (state.mouse.rightClicked && state.mode.type == "editor") {
        state.mouse.rightClicked = false;
        // const len = Object.values(Tile).filter(v => typeof v == "string").length;
        // const i: number = Tile[Tile[state.mode.tile]];
        // console.log(len)
        // const j = (i + 1) % len;
        // state.mode.tile = Tile[Tile[j]]
    }
}