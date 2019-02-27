namespace ASC {
    export class Piece {
        private static _fieldWidth:number;

        public static initialize(width: number) {
            if (width < MIN_FIELD_WIDTH || width > MAX_FIELD_WIDTH) {
                throw new Error("Invalid Field Size");
            }
            Piece._fieldWidth = width;
            //
        }
        private _name: string;
        private _shape: number[] = [];
        private _orientations: number[][];
        private _offset: number;
        private _initialOrientation: number;
        private _currentOrientation: number = 0;
        private _x: number = 0;
        private _y: number = 0;
        private _width: number;
        private _blockCount: number;
        private _color: TSE.Color;
        

        public constructor(name: string, shape: number[], offset: number = 0, initOrient: number = 0, color: TSE.Color = TSE.Color.red()) {
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
        }

        private setShape(shape: number[]): void {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            for (let i of shape) {
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._shape = shape;
            this._orientations.push(shape);
            let cw = [];
            let ccw = [];
            let cwcw = [];
            for (let i of shape) {
                cw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                ccw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        }

        public rotate(dir: Rotations):void {
            this._currentOrientation = (this._currentOrientation + dir) % 4
            // kicks
        }
    }
}