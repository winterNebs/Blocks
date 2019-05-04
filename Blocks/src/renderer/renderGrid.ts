import * as PIXI from "pixi.js"

export class RenderGrid extends PIXI.Container {
    private _sprites: PIXI.Sprite[];
    private _width: number;
    private _height: number;
    private _texture: PIXI.Texture;
    private _size: number;
    private _x: number;
    private _y: number;
    public constructor(width: number, height: number, size: number = 24, x: number = 0, y: number = 0) {
        super();
        this._width = width;
        this._height = height
        this._size = size;
        this._x = x;
        this._y = y;
        //this._texture = PIXI.Loader.shared.resources.b.texture;
        this._texture = PIXI.Texture.from("assets/textures/b.png");
        this.initalizeSprites();
    }
    private initalizeSprites(): void {
        this._sprites = [];
        for (let i = 0; i < this._width * this._height; ++i) {
            let s = new PIXI.Sprite(this._texture);
            s.height = this._size;
            s.width = this._size;
            s.x = i % this._width * this._size + this._x;
            s.y = ~~(i / this._width) * this._size + this._y;
            s.tint = 0x000000;
            //tint
            this.addChild(s);
            this._sprites.push(s);
        }
    }
    //Color is hex
    private updateColor(index: number, color: number): void {
        //if (this._sprites[index].tint != color) {
        if (color < 0) {
            this._sprites[index].tint = 0x000000;
        }
        else {
            this._sprites[index].tint = color;
        }
        //}
    }
    public updateGrid(Field: number[]): void {
        for (let i = 0; i < Field.length; ++i) {
            this.updateColor(i, Field[i]);
        }
    }
}
