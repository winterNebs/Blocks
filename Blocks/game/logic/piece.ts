namespace ASC {
    export class Piece {

        private _name: string;                      //Name of piece (ie. X)
        private _shape: number[] = [];              //The shape of piece (array of indecies to be filled)
        private _orientations: number[][] = [];          //Precomputed orientations/rotations
        private _offset: number;                    //Spawning offset for top left corner of the peice (starting from top left going right)
        private _initialOrientation: number;        //Spawn orientation
        private _currentOrientation: number = 0;    //Current orientation
        private _x: number = 0;
        private _y: number = 0;
        //private _width: number;                   //Width of the piece (?)
        private _blockCount: number;                //Number of blocks the piece is made up of
        private _color: number;                     //Color of piece


        public constructor(name: string, shape: number[], offset: number = 0, color: number = 0xFFFFFF, initOrient: number = 0) {
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this.reset();
        }
        public validateOffset(width: number): boolean {
            for (let i of this._orientations[this._initialOrientation]) {
                if (~~(i / 5) !== ~~(((i % 5) + ~~(i / 5) * width + this._offset) / width)) {
                    throw new Error("Invalid offset! Piece will spawn out of bounds:");
                }
            }
            return true;
        }
        public initRotations(): void {
            this._orientations.push(this._shape);
            let temp: number[] = [];
            for (let i of this._shape) {
                temp.push(20 - 5 * (i % 5) + ~~(i / 5));
            }
            this._orientations.push(temp);
            temp = [];
            for (let i of this._shape) {
                temp.push(24 - i);
            }
            this._orientations.push(temp);
            temp = [];
            for (let i of this._shape) {
                temp.push(4 + 5 * (i % 5) - ~~(i / 5));
            }
            this._orientations.push(temp);
        }

        private setShape(shape: number[]): void {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            this._blockCount = shape.length;
            for (let i of shape) {
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._blockCount = shape.length;
            this._shape = shape;
            this._orientations.push(shape);
            let cw = [];
            let ccw = [];
            let cwcw = [];
            for (let i of shape) {
                cw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                ccw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        }

        public rotate(dir: Rotations): void {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
        }
        public move(x: number, y: number): void {
            this._x += x;
            this._y += y;
        }
        public getCoords(width: number): number[] {
            let c = [];
            for (let i of this._orientations[this._currentOrientation]) {
                let newI = (i % 5) + ~~(i / 5) * width;
                c.push(newI + this._x + this._y * width);
            }
            return c;
        }
        public getYVals(): number[] {
            let c = [];
            for (let i of this._orientations[this._currentOrientation]) {
                let y = ~~(i / 5) + this._y;
                c.push(y);
            }
            return c;
        }
        public reset(): void {
            this._currentOrientation = this._initialOrientation;
            this._x = this._offset;
            this._y = 0;
        }
        public getCopy(): Piece {
            let copy = new Piece(this._name, this._shape, this._offset, this._initialOrientation, this._color);
            copy._orientations = this._orientations;
            copy._x = this._x;
            copy._y = this._y;
            copy._currentOrientation = this._currentOrientation;
            copy._color = this._color;
            return copy;
        }
        public getRenderShape(): number[] {
            let temp = [];
            for (let i = 0; i < 25; ++i) {
                temp.push(0x000000);
            }
            for (let i of this._shape) {
                temp[i] = this._color;
            }
            return temp;
        }
        public get name(): string {
            return this._name;
        }
        public get color(): number {
            return this._color;
        }
    }
}