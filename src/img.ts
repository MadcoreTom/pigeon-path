import { XY } from "./world";

type SingleTileDef = readonly [number, number] | readonly [number, number, number, number];

export class TileImage<K extends string> {
    private image: any;
    private ready = false;
    private rows;
    private cols;
    public constructor(src: string, public readonly size: number, private readonly tiles: { [key in K]: SingleTileDef }) {
        this.image = new Image();
        this.image.onload = () => {
            this.ready = true;
            this.rows = Math.floor(this.image.width / size);
            this.cols = Math.floor(this.image.height / size);
        }
        this.image.src = src;
    }

    public draw(ctx: CanvasRenderingContext2D, tile: XY, pos: XY, [width, height]: XY = [1, 1]) {
        if (this.ready) {
            const size = this.size;
            ctx.drawImage(this.image,
                tile[0] * size, tile[1] * size, size * width, size * height,
                Math.floor(pos[0]), Math.floor(pos[1]), size * width, size * height)
        }
    }

    public drawTile(ctx: CanvasRenderingContext2D, pos: XY, name: K) {
        if (this.ready) {
            const size = this.size;
            const def = this.tiles[name];
            const width = def.length == 4 ? def[2] : 1;
            const height = def.length == 4 ? def[3] : 1;

            ctx.drawImage(this.image,
                def[0] * size, def[1] * size, size * width, size * height,
                Math.floor(pos[0]), Math.floor(pos[1]), size * width, size * height)
        }

    }
}
