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

        public constructor(width: number = 12) {
            InputManager.RegisterObserver(this);
            if (width > MAX_FIELD_WIDTH || width < MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;

            //For now:
            this._pieces.push(new Piece("T", [11, 12, 13, 14]))
            this._pieces.push(new Piece("L", [7, 12, 17, 18]))
            this._pieces.push(new Piece("Z", [11, 12, 17, 18]))

            this.resetGame();
        }


        public resetGame() {
            this._field = new Field(this._width);
            this._queue = new Queue(Math.random() * Number.MAX_VALUE, this._pieces);//NO bag size for now
            this._hold = undefined;
            this._currentPiece = this._queue.getNext();
        }


        //TODO:

        //Get inputs for active piece
        //Collision detection on movement
        //Apply kicks and rotation (Piece needs offset function)
        //sad

        //Phases?:
        //Falling
        //Lock

        //Line clear function

        //Gravity event

        //Garbage Event
        RecieveNotification(keyevent: KeyboardEvent, down: boolean): void {
            switch (keyevent.keyCode) {
                case Keys.UP:
                    this._inputs[Inputs.CW] = down;
                    break;
                case Keys.RIGHT:
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case Keys.DOWN:
                    this._inputs[Inputs.SD] = down;
                    break;
                case Keys.LEFT:
                    this._inputs[Inputs.LEFT] = down;
                    break;
                case Keys.S:
                    this._inputs[Inputs.CCW] = down;
                    break;
                case Keys.D:
                    this._inputs[Inputs.CWCW] = down;
                    break;
                case Keys.SPACE:
                    this._inputs[Inputs.HD] = down;
                    break;
                case Keys.SHIFT:
                    this._inputs[Inputs.HOLD] = down;
                    break;
            }
            console.log(this._inputs);
        }
    }
}