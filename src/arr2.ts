export class Arr2<T> {
    private data: T[];
    public constructor(public readonly width, public readonly height, private readonly defaultValue: T) {
        this.data = new Array<T>().fill(defaultValue, 0, width * height);
    }

    public inRange(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    public fill(func: (x: number, y: number) => T): void {
        for (let i = 0; i < this.width * this.height; i++) {
            this.data[i] = func(i % this.width, Math.floor(i / this.width));
        }
    }

    public forEach(func: (x: number, y: number, value: T) => void): void {
        for (let i = 0; i < this.width * this.height; i++) {
            func(i % this.width, Math.floor(i / this.width), this.data[i]);
        }
    }

    public get(x: number, y: number, defaultVal?:T): T {
        if (this.inRange(x, y)) {
            return this.data[x + this.width * y];
        }
        return defaultVal ? defaultVal : this.defaultValue;
    }

    public set(x: number, y: number, value: T): void {
        if (this.inRange(x, y)) {
            this.data[x + this.width * y] = value;
        }
    }
}