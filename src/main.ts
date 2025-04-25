import { COLOURS } from "./colours";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const WIDTH = 240;
const HEIGHT = 240;

ctx.fillStyle = COLOURS.SECONDARY;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Draw dot grid
ctx.fillStyle = COLOURS.PRIMARY;
for(let x=6; x<240;x+=13){
    for(let y=6; y<240;y+=13){
        ctx.fillRect(x, y-1, 1, 3);
        ctx.fillRect(x-1, y, 3, 1);
    }
}

// Some areas not visible
for(let x=0; x<240;x+=13){
    for(let y=0; y<240;y+=13){
        if(x==130){
            ctx.fillStyle = COLOURS.PRIMARY;
            ctx.fillRect(x, y, 13,13);
        } else if(x>130){
            ctx.fillStyle = COLOURS.DARK;
            ctx.fillRect(x, y, 13,13);
        }

        if(x==130 && y==26){
            ctx.strokeStyle = COLOURS.LIGHT;
            ctx.strokeRect(x+1, y+1, 13-2,13-2);

        }
    }
}