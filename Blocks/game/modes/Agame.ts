namespace ASC {
    const KICKVER = 1;
    export abstract class AGame {
        protected _field: Field;
        protected _currentPiece: Piece;
        protected _hold: Piece;
        protected _queue: AQueue;
        protected _width: number
        protected _bagSize: number;
        protected _pieces: Piece[] = [];
        protected _controls: number[];
        protected _state: State = State.LOSE;
        protected _seed: number;
        private _time: Stopwatch;
        private _inputs: Inputs[];
        private _updateCallback: Function;
        private _updateHoldCallback: Function;
        private _updateQueueCallback: Function;
        private _updateFieldCallback: Function;

        public constructor(
            width: number = 12, bagSize: number = 7,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new Piece("S", [7, 8, 11, 12], 2, 0x00FF00),
            new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay: number = 100, repeat: number = 10) {
            if (delay < 1) {
                throw new Error("Invalid Delay");
            }
            if (repeat < 1) {
                throw new Error("Invalid Repeat");
            }
            if (width > MAX_FIELD_WIDTH || width < MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._bagSize = bagSize;
            //Verify piece offset.
            for (let p of pieces) {
                p.validateOffset(this._width);
            }
            this._pieces = pieces;
            this._pieces.forEach((i) => (i.initRotations()));

            this._time = new Stopwatch();
        }
        protected randomSeed() {
            this._seed = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
        }
        //public static replay(replay: string): AGame {
        //   le
        //}
        public resetGame(): void {
            if (this._inputs != undefined) {
                console.log(JSON.stringify(this._seed) + "; " + this._inputs.join());
            }
            this._field = new Field(this._width);
            this._hold = undefined;
            this.next();
            this._state = State.ACTIVE;
            this._time.start();
            this._inputs = [];
            this.update();

        }
        protected gameOver(): void {
            this._state = State.LOSE;
            this.update();
        }

        protected next(): void {
            if (this._queue.hasNext()) {
                this._currentPiece = this._queue.getNext();
                if (!this.checkShift(0, 0)) {
                    this.gameOver();
                    this._state = State.LOSE;
                }
            }
            else {
                this.gameOver();
                this._state = State.LOSE;
            }
        }
        protected hold(): void {
            if (this._currentPiece)
                this._currentPiece.reset();
            if (this._hold === undefined) {
                this._hold = this._currentPiece;
                this.next();
                return;
            }
            let temp = this._hold;
            this._hold = this._currentPiece;
            this._currentPiece = temp;
        }
        protected hardDrop(): void {
            this.sonicDrop();
            this.lock();
        }
        protected sonicDrop(): void {
            let i = 0;
            while (this.checkShift(0, i)) {
                ++i;
            }
            this._currentPiece.move(0, i - 1);
        }

        protected move(dir: Directions): void {
            switch (dir) {
                case Directions.LEFT:
                    if (this.checkShift(-1, 0)) {
                        this._currentPiece.move(-1, 0);
                    }
                    break;
                case Directions.RIGHT:
                    if (this.checkShift(1, 0)) {
                        this._currentPiece.move(1, 0);
                    }
                    break;
                case Directions.DOWN:
                    if (this.checkShift(0, 1)) {
                        this._currentPiece.move(0, 1);
                    }
                    break;
            }
        }

        protected checkShift(x: number, y: number): boolean {
            let coords = this._currentPiece.getCoords(this._width);
            let yvals = this._currentPiece.getYVals();
            for (let i = 0; i < coords.length; ++i) {
                let block: Block = this._field.getAt(coords[i] + x + y * this._width);
                if (block == null ||                           //Up, Down bounds
                    yvals[i] != ~~((coords[i] + x) / this._width) ||  //Left, Right wrapping bounds
                    block.solid                               //Colliding with a block
                ) {
                    return false;
                }
            }
            return true;
        }

        protected checkPC(): boolean {
            for (let i = 0; i < this._width * FIELD_HEIGHT; ++i) {
                if (this._field.getAt(i).clearable && this._field.getAt(i).solid) {
                    return false
                }
            }
            return true;
        }

        protected checkImmobile(): boolean {
            return !(this.checkShift(0, 1) ||
                this.checkShift(0, -1) ||
                this.checkShift(1, 0) ||
                this.checkShift(-1, 0));
        }

        protected rotate(dir: Rotations): void {
            this._currentPiece.rotate(dir);

            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== Rotations.CWCW) { //No 180 kicks
                let sign = (dir - 2); // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
                console.log("Trying to kick:")
                //for (let x = 0; x < 8; ++x) {
                //    let xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                //    for (let i = 0; i < (x + 1) * 2; ++i) {//tune this
                //        let ykicks = (Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4));
                //        console.log(xkicks, ykicks);
                //        if (this.checkShift(xkicks, ykicks)) {
                //            this._currentPiece.move(xkicks, ykicks);
                //            return; //successful kick
                //        }
                //    }
                //}
                let xkicks = [];
                let ykicks = [];
                let indexxx = [13, 17, 18, 22, 23, 19, 24, 14, 11, 7, 11, 8, 9, 2, 3]
                for (let i of indexxx) {
                    xkicks.push((i % 5) - 2);
                    ykicks.push(~~(i / 5) - 2);
                }
                for (let i = 0; i < xkicks.length; ++i) {
                    console.log(sign * xkicks[i] + ", " + ykicks[i]);
                    if (this.checkShift(sign * xkicks[i], ykicks[i])) {
                        this._currentPiece.move(sign * xkicks[i], ykicks[i]);
                        return; //successful kick
                    }
                }
            }
            console.log("Failed Kick.");
            this._currentPiece.rotate(4 - dir); // Failed, unrotate.
        }

        protected lock() {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new Block(this._currentPiece.color, true, true));
            this.next();
        }

        protected update(): void {
            this.updateField();
            this._updateQueueCallback(this._queue.getQueue());
            this._updateHoldCallback(this._hold);
            this._updateCallback();
        }
        private updateField(): void {
            let temp = this._field.getColors();
            let current = this._currentPiece.getCopy();
            this.sonicDrop();
            let ghost = this._currentPiece.getCopy();
            this._currentPiece = current;
            this._updateFieldCallback(temp, current.getCopy(), ghost);

        }
        protected appendRow(rows: Block[][], yval: number) {
            for (let r of rows) {
                this._field.appendRow(r, yval);
            }
        }
        protected clearLines(yvals: number[]): number { //returns number of lines cleared
            let lines = 0;
            yvals.sort(function (a, b) { return a - b }); //sort and remove backwards
            for (let y of yvals) { //checks only placed rows.
                for (let i = 0; i < this._width; i++) {
                    let block = this._field.getAt(y * this._width + i);
                    if (!block.solid || !block.clearable) {
                        break;
                    }
                    if (i == this._width - 1) {// Loop ends/ also this sucks
                        ++lines;
                        this._field.clearLineAt(y);
                    }
                }//re move rows
            }

            return lines;
        }
        public setUpdate(u: Function) {
            this._updateCallback = u;
        }
        public setUpdateHold(u: Function) {
            this._updateHoldCallback = u;
        }
        public setUpdateQueue(u: Function) {
            this._updateQueueCallback = u;
        }
        public setUpdateField(u: Function) {
            this._updateFieldCallback = u;
        }
        public get time(): number {
            return this._time.getTime();
        }
        public get state(): State {
            return this._state;
        }

        public readinput(input: Inputs) {
            if (this._state == State.ACTIVE) {
                switch (input) {
                    case Inputs.CW:
                        this._inputs.push(input);
                        this.rotate(Rotations.CW);
                        break;
                    case Inputs.RIGHT:
                        this._inputs.push(input);
                        this.move(Directions.RIGHT);
                      
                        break;
                    case Inputs.SD:
                        this._inputs.push(input);
                        this.move(Directions.DOWN);
                        break;
                    case Inputs.LEFT:
                        this._inputs.push(input);
                        this.move(Directions.LEFT);
                        break;
                    case Inputs.CCW:
                        this._inputs.push(input);
                        this.rotate(Rotations.CCW);
                        break;
                    case Inputs.CWCW:
                        this._inputs.push(input);
                        this.rotate(Rotations.CWCW);
                        break;
                    case Inputs.HD:
                        this._inputs.push(input);
                        this.hardDrop();
                        break;
                    case Inputs.HOLD:
                        this._inputs.push(input);
                        this.hold();
                        break;
                    case Inputs.SONIC:
                        this._inputs.push(input);
                        this.sonicDrop();
                        break;
                    default:
                        break;
                }
            }
            this.update();//remove this and only update when needed
        }
    }
}