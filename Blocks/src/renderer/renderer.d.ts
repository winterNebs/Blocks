import * as PIXI from "pixi.js";
export declare class Renderer extends PIXI.Container {
    private _field;
    private _queue;
    private _hold;
    private _progress;
    private _time;
    private _progressText;
    constructor(width: number, progress: string);
    updateField(Field: number[]): void;
    updateQueue(q: number[][]): void;
    updateHold(p: number[]): void;
    updateProgress(t: string): void;
    updateTime(t: string): void;
}
