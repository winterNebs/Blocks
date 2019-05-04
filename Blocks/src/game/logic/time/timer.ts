
export class Timer {
    private _running: boolean = false;
    private _request: number;
    private _expected: number;
    private _expectedTick: number;
    private _length: number;
    private _interval: number;
    private _tick: Function;
    private _end: Function;
    public constructor(length: number, interval: number, tick: Function, end: Function) {
        this._length = length;
        this._interval = interval;
        this._tick = tick;
        this._end = end;
    }
    public start(): void {
        this.stop();
        this._running = true;
        this._expected = performance.now() + this._length;
        this._expectedTick = performance.now() + this._interval;
        this._request = window.requestAnimationFrame(this.step.bind(this));

    }
    public stop(): void {
        this._running = false;
        window.cancelAnimationFrame(this._request);
    }
    private step(): void {
        if (this._running) {
            if (performance.now() >= this._expectedTick) {
                this._expectedTick = performance.now() + this._interval;
                this._tick();
            }
            else if (performance.now() >= this._expected) {
                this.stop()
                this._end();
                return;
            }
            window.requestAnimationFrame(this.step.bind(this));
        }
    }
}
