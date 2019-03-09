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
            this._pieces.push(new Piece("a", [0,1,8, 13,20,24]))

            this.resetGame();
            app.stage.addChild(this._renderer);
        }


        public resetGame() {
            this._field = new Field(this._width);
            this._queue = new Queue(Math.random() * Number.MAX_VALUE, this._pieces);//NO bag size for now
            this._hold = undefined;
            this._currentPiece = this._queue.getNext();
            this.update();
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
                    this._currentPiece.move(Directions.UP, 1);
                    this._inputs[Inputs.CW] = down;
                    break;
                case Keys.RIGHT:
                    this._currentPiece.move(Directions.RIGHT, 1);
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case Keys.DOWN:
                    this._currentPiece.move(Directions.DOWN, 1);
                    this._inputs[Inputs.SD] = down;
                    break;
                case Keys.LEFT:
                    this._inputs[Inputs.LEFT] = down;
                    this._currentPiece.move(Directions.LEFT, 1);
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
            this.update();
            //console.log(this._inputs);
        }
    }
}