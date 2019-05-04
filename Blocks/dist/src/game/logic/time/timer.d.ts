export declare class Timer {
    private _running;
    private _request;
    private _expected;
    private _expectedTick;
    private _length;
    private _interval;
    private _tick;
    private _end;
    constructor(length: number, interval: number, tick: Function, end: Function);
    start(): void;
    stop(): void;
    private step;
}
