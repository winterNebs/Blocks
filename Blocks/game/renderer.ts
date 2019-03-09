namespace ASC {
    export class Renderer extends PIXI.Container {
        private _sprites: PIXI.Sprite[];
        private _width: number;
        private _texture: PIXI.Texture;
        private _size: number = 24;
        public constructor(width: number) {
            super();
            this._width = width;
            this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
            this.initalizeSprites();
        }
        private initalizeSprites(): void {
            this._sprites = [];
            for (let i = 0; i < this._width * FIELD_HEIGHT; ++i) {
                let s = new PIXI.Sprite(this._texture);
                s.x = i % this._width * this._size;
                s.y = ~~(i / this._width) * this._size;

                //tint
                this.addChild(s);
                this._sprites.push(s);
            }
        }
        //Color is hex
        private updateColor(index: number, color: number): void {
            //if (this._sprites[index].tint != color) {
            this._sprites[index].tint = color;
            //}
        }
        public updateField(Field: number[]): void {
            for (let i = 0; i < Field.length; ++i) {
                this.updateColor(i, Field[i]);
            }
        }
    }
}