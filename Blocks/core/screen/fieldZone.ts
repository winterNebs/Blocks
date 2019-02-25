/// <reference path="zone.ts" />
namespace TSE {

    export enum ColorNum {
        RED, BLUE, GREEN
    }

    class BlockComponent extends SpriteComponent {

        public constructor(name: string, color: ColorNum = ColorNum.RED, size: number = 16) {
            super(name, "r", size, size);
            this.setColor(color);
        }
        public setColor(color: ColorNum): void {
            switch (color) {
                case ColorNum.RED:
                    this._sprite.setMaterial("r");
                    break;
                case ColorNum.BLUE:
                    this._sprite.setMaterial("b");
                    break;
                case ColorNum.GREEN:
                    this._sprite.setMaterial("g");
                    break;
            }
        }
    }

    export class FieldZone extends Zone {

        private _width: number;
        private _height: number = 25;
        private _resolution: number;
        private _array: SimObject[] = [];
        private _fieldObject: SimObject;

        public constructor(id: number, width: number = 10, resolution: number = 16) {
            super(id, "field", "Game Field");
            this._width = width;
            this._resolution = resolution;
        }

        private initializeArray(): void {
            for (let i = 0; i < this._height * this._width; ++i) {
                let b = new SimObject(i + 2, "Block " + i.toString());
                //if (i % 2 == 0) {
                b.addComponent(new BlockComponent(i.toString(), ColorNum.RED, this._resolution));
                //}
                //else {
                //    b.addComponent(new BlockComponent(i.toString(), ColorNum.BLUE, this._resolution));
                //}
                b.transform.position.x = (i % this._width) * this._resolution;
                b.transform.position.y = (i / this._width >> 0) * this._resolution;
                //console.log(b.transform.position.x + "," + b.transform.position.y);
                this._array.push(b);
                // let b = new BlockComponent(i.toString(), ColorNum.RED);
                //this._fieldObject.addComponent(b);
                //this._array.push(b);
            }
        }

        public load(): void {

            this._fieldObject = new SimObject(0, "field");
            this.initializeArray();
            for (let b of this._array) {
                this._fieldObject.addChild(b);
            }
            
            this.scene.addObject(this._fieldObject);

            super.load();
        }

        public update(time: number): void {
            this.updateField([[0, 2, 2]]);
            super.update(time);
        }
        /**
         * Takes an array tuples to change [number, color]
         * @param Message array of [x,y, color]//color num for now
         */
        public updateField(Message: [number, number, ColorNum][]): void {
            for (let tuple of Message) {
                let temp = (this._array[this._width * tuple[0] + tuple[1]].getComponent(0)) as BlockComponent;
                temp.setColor(tuple[2]);
            }
        }
    }
}