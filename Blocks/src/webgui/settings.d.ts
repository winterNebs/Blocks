/// <reference path="../game/logic/enums.d.ts" />
/// <reference path="pieceeditor.d.ts" />
export declare class Settings {
    private static _staticQueue;
    private static _mapShape;
    private static _config;
    private static _mapData;
    private static _pieceEditor;
    private static _widthSlider;
    private static _mode;
    private static _run;
    static init(mode?: number): void;
    private static restartGame;
    private static readCookie;
    private static saveCookie;
    private static loadMap;
}
