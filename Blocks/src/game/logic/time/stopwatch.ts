
export class Stopwatch {
    private _start: number;
    private _active: boolean;
    private _elapsed: number;
    public constructor() {
    }
    public start(): void {
        this._active = true;
        this._start = performance.now();
        this._elapsed = 0;
    }
    public stop(): void {
        this._elapsed = this.getTime();
        this._active = false;
    }
    public resume(): void {
        this._start = performance.now();
        this._active = true;
    }
    public getTime(): number {
        if (this._active) {
            return performance.now() - this._start + this._elapsed;
        }
        else {
            return this._elapsed;
        }
    }
}
