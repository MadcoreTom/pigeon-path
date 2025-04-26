import { Controls, isKeyTyped } from "./controls";
import { State, Tile, XY } from "./world";

export function update(state: State) {
    if(state.moving == null){
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
                state.path.pop();
            } else {
                const collides = state.tiles.get(newPos[0], newPos[1]) == Tile.WALL;
                if (!collides) {
                    state.path.push(newPos);
                } else {
                    console.log("collides", newPos)
                }
            }
        }
        if (isKeyTyped(Controls.CONFIRM)) {
            state.moving = 0;
        }
    } else {
        // moving
        state.moving += 0.01;
        if (state.moving >= 1) {
            state.moving = null;
            const end = state.path[state.path.length - 1];
            state.path = [end];
        }
    }
}