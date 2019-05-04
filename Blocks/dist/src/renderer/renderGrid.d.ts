import * as PIXI from "pixi.js";
export declare class RenderGrid extends PIXI.Container {
    private _sprites;
    private _width;
    private _height;
    private _texture;
    private _size;
    private _x;
    private _y;
    constructor(width: number, height: number, size?: number, x?: number, y?: number);
    private initalizeSprites;
    private updateColor;
    updateGrid(Field: number[]): void;
}
