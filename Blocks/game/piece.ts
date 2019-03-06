namespace ASC {
    export class Piece {
        private static _fieldWidth:number;  // Width of the user's feild
        /**
         * Initalizes the piece class, (called once per player);
         * @param width Width of player's field
         */
        public static initialize(width: number) {   
            if (width < MIN_FIELD_WIDTH || width > MAX_FIELD_WIDTH) {   // Cannot exceed maximum/min size
                throw new Error("Invalid Field Size");
            }
            Piece._fieldWidth = width;
        }

        private _name: string;                      //Name of piece (ie. X)
        private _shape: number[] = [];              //The shape of piece (array of indecies to be filled)
        private _orientations: number[][];          //Precomputed orientations/rotations
        private _offset: number;                    //Spawning offset for top left corner of the peice (starting from top left going right)
        private _initialOrientation: number;        //Spawn orientation
        private _currentOrientation: number = 0;    //Current orientation
        private _x: number = 0;                     //X location
        private _y: number = 0;                     //Y location
        //private _width: number;                     //Width of the piece (?)
        private _blockCount: number;                //Number of blocks the piece is made up of
        private _color: TSE.Color;                  //Color of piece
        

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
        public move(dir: Directions):void {
            switch (dir) {
                case Directions.UP:
                    this._y -= 1;
                    break;
                case Directions.RIGHT:
                    this._x += 1;
                    break;
                case Directions.DOWN:
                    this._y += 1;
                    break;
                case Directions.LEFT:
                    this._x -= 1;
                    break;
            }
        }
        public getCoords(): number[] {
            let c = [];
            for (let i of this._shape) {
                c.push(i + this._x + this._y * Piece._fieldWidth);
            }
            return c;
        }
    }
}