export class TileImage {
    private image: any;
    private ready = false;
    private rows;
    private cols;
    public constructor(src: string, public readonly size: number) {
        this.image = new Image();
        this.image.onload = () => {
            this.ready = true;
            this.rows = Math.floor(this.image.width / size);
            this.cols = Math.floor(this.image.height / size);
        }
        this.image.src = src;
    }

    public draw(ctx: CanvasRenderingContext2D, tile: [number, number], pos: [number, number]) {
        if (this.ready) {
            const size = this.size;
            ctx.drawImage(this.image,
                tile[0] * size, tile[1] * size, size, size,
                Math.floor(pos[0]), Math.floor(pos[1]), size, size)
        }
    }
}