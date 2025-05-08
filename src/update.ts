import { Controls, isKeyTyped } from "./controls";
import { loadLevel } from "./levels";
import { SOUND } from "./sound";
import { isFinalLength, isSecondFinalLength, State, Tile, XY } from "./world";

export function update(state: State, delta: number) {
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
                const collides = state.tiles.get(newPos[0], newPos[1]) == Tile.WALL;
                if (!collides) {
                    const needsToFinishOnThisTile = state.tiles.get(newPos[0], newPos[1]) == Tile.DOOR_CLOSED;
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
            if (isFinalLength(state)) {
                state.mode = { type: "moving", progress: 0 };
                SOUND.openDoor();
            } else {
                SOUND.collide();
            }
        }
        if(isKeyTyped(Controls.UNDO)){
            state.path = [state.path[0]];
            SOUND.retreat();
        }

        // speech bubble text
        if (state.path.length == 1) {
            state.speechBubble = "Move";
        } else if (state.finalMoves + 1 - state.path.length > 0) {
            state.speechBubble = "" + (state.finalMoves + 1 - state.path.length);
        } else {
            const end = state.path[state.path.length - 1];
            const t = state.tiles.get(end[0], end[1]);
            if (t == Tile.DOOR_CLOSED) {
                state.speechBubble = "Open!"
            } else if (t == Tile.FLAG) {
                state.speechBubble = "Finish!"
            } else {
                state.speechBubble = "Go!"
            }
        }
    } else if (state.mode.type == "moving") {
        state.speechBubble = null;
        // moving
        state.mode.progress += delta * 0.01;
        if (state.mode.progress >= state.path.length) {
            state.mode = { type: "play" };
            const end = state.path[state.path.length - 1];
            state.path = [end];
            const tile = state.tiles.get(end[0], end[1]);
            if (tile == Tile.DOOR_CLOSED) {
                SOUND.openDoor();
                state.tiles.set(end[0], end[1], Tile.DOOR_OPENED);
            } else if (tile == Tile.FLAG) {
                SOUND.newLevel();
                state.mode = { type: "transition", progress: 0, direction: "down", levelDelta: 1 };
            }
        }
    } else if (state.mode.type == "transition") {
        state.speechBubble = null;
        if (state.mode.direction == "down") {
            state.mode.progress += delta * 0.003;
            if (state.mode.progress > 1.5) {
                state.mode.progress = 1;
                state.mode.direction = "up";
                state.level += state.mode.levelDelta;
                loadLevel(state, state.level);
            }
        } else {
            state.mode.progress -= delta * 0.003;
            if (state.mode.progress < 0) {
                state.mode = { type: "play" }
            }

        }
    }

    calcMoves(state);
    if (isKeyTyped(Controls.RESET)) {
        state.mode = { type: "transition", progress: 0, direction: "down", levelDelta: 0 };
    }
}
function calcMoves(state: State) {
    state.modifiers = [];
    state.path.forEach(p => {
        const t = state.tiles.get(p[0], p[1]);
        if (t == Tile.MULTIPLY) {
            state.modifiers.push("x")
        } else if (t == Tile.PLUS) {
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