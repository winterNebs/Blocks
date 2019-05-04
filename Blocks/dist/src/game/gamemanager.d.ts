import { Renderer } from "../renderer/renderer";
import { ITriggerObserver } from "./ITriggerObserver";
import { Config } from "./config/config";
import { MapData } from "./config/mapData";
import { Mode } from "./logic/enums";
export declare class GameManager implements ITriggerObserver {
    private _visible;
    private _renderer;
    private _game;
    private _config;
    private _mapdata;
    private _controls;
    private _replay;
    private _timer;
    constructor(c: Config, mode: Mode, mapdata?: MapData);
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
    readonly renderer: Renderer;
}
