import { RUN } from "../app";
export declare class GameManager implements ASC.ITriggerObserver {
    private _visible;
    private _renderer;
    private _game;
    private _config;
    private _mapdata;
    private _controls;
    private _replay;
    private _timer;
    constructor(c: ASC.Config, mode: ASC.Mode, mapdata?: ASC.MapData, run?: RUN);
    resetGame(): void;
    private updateGame;
    private updateHold;
    private updateQueue;
    private updateField;
    private static lighten;
    private static darken;
    private static minGray;
    touchControl(code: number): void;
    Triggered(keyCode: number): void;
    setReplay(seed: number, replay: string): void;
    private replay;
}
