/// <reference path="zone.ts" />
namespace TSE {

    class BlockComponent extends SpriteComponent {

        public constructor(name: string, color: number = -1, size: number = 16) {
            super(name, color.toString(), size, size);
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
                b.addComponent(new BlockComponent(i.toString(), -1, this._resolution));
                b.transform.position.x = (i % this._width) * this._resolution;
                b.transform.position.y = (i / this._width >> 0) * this._resolution;
                this._array.push(b);
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
            super.update(time);
        }
        /**
         * Takes an array tuples to change [number, color]
         * @param Message array of [i, color]//color num for now
         */
        public updateField(Message: [number, number][]): void {
            for (let tuple of Message) {
                this._array[tuple[0]].swapComponent(0, new BlockComponent(tuple[0].toString(), tuple[1], this._resolution));
            }
        }
    }
}