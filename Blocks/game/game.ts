namespace ASC {
    enum Inputs {
        RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
    }
    export class Game implements IInputObserver {
        private _field: Field;
        private _currentPiece: Piece;
        private _hold: Piece;
        private _queue: Queue;
        private _width: number

        private _pieces: Piece[] = [];
        //Inputs for the game:
        //                            Right, SD,    Left,  CW,    CCW,   180(CWCW),Hold,HD     
        private _inputs: boolean[] = [false, false, false, false, false, false, false, false];

        private _renderer: Renderer;

        public constructor(width: number = 12) {
            InputManager.RegisterObserver(this);
            if (width > MAX_FIELD_WIDTH || width < MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._renderer = new Renderer(this._width);

            //For now:
            this._pieces.push(new Piece("T", [11, 12, 13, 17]))
            this._pieces.push(new Piece("L", [7, 12, 17, 18]))
            this._pieces.push(new Piece("Z", [11, 12, 17, 18]))
            this._pieces.push(new Piece("a", [0, 1, 8, 13, 20, 24]))
            this._pieces.forEach((i) => (i.initRotations()));
            this.resetGame();
            app.stage.addChild(this._renderer);
        }


        public resetGame() {
            this._field = new Field(this._width);
            this._queue = new Queue(Math.random() * Number.MAX_VALUE, this._pieces);//NO bag size for now
            this._hold = undefined;
            this.next();
            this.update();
        }

        private next() {
            this._currentPiece = this._queue.getNext();
        }

        //TODO:

        //Apply kicks and rotation
        //Phases?:
        //Falling
        //Lock

        //Line clear function

        //Gravity event

        //Garbage Event
        private move(dir: Directions): void {
            switch (dir) {
                case Directions.LEFT:
                    if (this.checkShift(-1, 0)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
                case Directions.RIGHT:
                    if (this.checkShift(1, 0)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
                case Directions.DOWN:
                    if (this.checkShift(0, 1)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
            }
        }

        private checkShift(x: number, y: number): boolean {
            let coords = this._currentPiece.getCoords(this._width);
            let yvals = this._currentPiece.getYVals();
            for (let i = 0; i < coords.length; ++i) {
                let block = this._field.getAt(coords[i] + x + y * this._width);
                if (block === undefined ||                          //Up, Down bounds
                    yvals[i] != ~~(coords[i] / this._width) ||      //Left, Right wrapping bounds
                    0 - x > coords[i] % this._width ||              //Left bound
                    this._width - x <= coords[i] % this._width ||   //Right bound
                    block.solid                                     //Colliding with a block
                ) {
                    return false;
                }
            }
            return true;
        }
        private rotate(dir: Rotations): void {
            this._currentPiece.rotate(dir);

            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== Rotations.CWCW) { //No 180 kicks
                let sign = dir - 2; // - for cw + for ccw for now.

            }

           this._currentPiece.rotate(4 - dir); // Failed, unrotate.
        }
        private lock() {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new Block(0xFFFFFF, true, true));
            this.next();
        }

        private update(): void {
            let temp = this._field.getColors();
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = 0xFFFFFF; /// for now
            }
            this._renderer.updateField(temp);
        }

        RecieveNotification(keyevent: KeyboardEvent, down: boolean): void {
            switch (keyevent.keyCode) {
                case Keys.UP:
                    if (down) {
                        this.rotate(Rotations.CW);
                    }
                    this._inputs[Inputs.CW] = down;
                    break;
                case Keys.RIGHT:
                    if (down) {
                        this.move(Directions.RIGHT);
                    }
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case Keys.DOWN:
                    if (down) {
                        this.move(Directions.DOWN);
                    }
                    this._inputs[Inputs.SD] = down;
                    break;
                case Keys.LEFT:
                    if (down) {
                        this.move(Directions.LEFT);
                    }
                    this._inputs[Inputs.LEFT] = down;
                    break;
                case Keys.S:
                    if (down) {
                        this.rotate(Rotations.CCW);
                    }
                    this._inputs[Inputs.CCW] = down;
                    break;
                case Keys.D:
                    if (down) {
                        this.rotate(Rotations.CWCW);
                    }
                    this._inputs[Inputs.CWCW] = down;
                    break;
                case Keys.SPACE:
                    if (down) {
                        this.lock();
                    }
                    this._inputs[Inputs.HD] = down;
                    break;
                case Keys.SHIFT:
                    this._inputs[Inputs.HOLD] = down;
                    break;
            }
            this.update();
            //console.log(this._inputs);
        }
    }
}