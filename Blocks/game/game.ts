namespace ASC {
    //TODO:
    //Score
    export const MAX_FIELD_WIDTH: number = 20;
    export const MIN_FIELD_WIDTH: number = 5;
    export const FIELD_HEIGHT: number = 25;
    enum Inputs {
        RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
    }
    export class Game implements ITriggerObserver {
        private _field: Field;
        private _currentPiece: Piece;
        private _hold: Piece;
        private _queue: Queue;
        private _width: number
        private _queueSize: number;
        private _pieces: Piece[] = [];
        private _controls: number[];
        private _renderer: Renderer;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(width: number = 12, queueSize: number = 6,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2), new Piece("L", [8, 11, 12, 13], 2), new Piece("J", [6, 11, 12, 13], 2),
            new Piece("Z", [11, 12, 17, 18], 2), new Piece("S", [12, 13, 16, 17], 2), new Piece("I", [11, 12, 13, 14], 2), new Piece("O", [12, 13, 17, 18], 2)],
            controls: number[] = [39, 40, 37, 38, 83, 68, 16, 32], delay: number = 100, repeat: number = 10) {
            if (delay < 1) {
                throw new Error("Invalid Delay");
            }
            if (repeat < 1) {
                throw new Error("Invalid Repeat");
            }
            InputManager.RegisterObserver(this);
            InputManager.RegisterKeys(this, [controls[Inputs.LEFT], controls[Inputs.RIGHT], controls[Inputs.SD]], delay, repeat);
            this._controls = controls
            if (width > MAX_FIELD_WIDTH || width < MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._queueSize = queueSize
            this._renderer = new Renderer(this._width, this._queueSize);
            this._hold = undefined;
            //For now:
            this._pieces = pieces;
            //this._pieces.push(new Piece("a", [0, 1, 8, 13, 20, 24]))
            this._pieces.forEach((i) => (i.initRotations()));
            this.resetGame();
            app.stage.addChild(this._renderer);
        }

        public resetGame(): void {
            this._field = new Field(this._width);
            this._queue = new Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._queueSize);//NO bag size for now
            this._hold = undefined;
            this.next();
            this.update();
        }

        private next(): void {
            this._currentPiece = this._queue.getNext();
        }

        //TODO:
        //Garbage Event
        private hold(): void {
            this._currentPiece.reset();
            if (this._hold === undefined) {
                this._hold = this._currentPiece;
                this.next();
                return;
            }
            [this._hold, this._currentPiece] = [this._currentPiece, this._hold];
        }
        private hardDrop(): void {
            this.sonicDrop();
            this.lock();
        }
        private sonicDrop(): void {
            let i = 0;
            while (this.checkShift(0, i)) {
                ++i;
            }
            this._currentPiece.move(0, i - 1);
        }

        private move(dir: Directions): void {
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

        private checkShift(x: number, y: number): boolean {
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
        private rotate(dir: Rotations): void {
            this._currentPiece.rotate(dir);

            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== Rotations.CWCW) { //No 180 kicks
                let sign = -(dir - 2); // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
                for (let x = 0; x < 8; ++x) {
                    let xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (let i = 0; i < (x + 1) * 2; ++i) {//tune this
                        let ykicks = Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4);
                        console.log(xkicks, ykicks);
                        if (this.checkShift(xkicks, ykicks)) {
                            this._currentPiece.move(xkicks, ykicks);
                            return; //successful kick
                        }
                    }
                }

            }
            console.log("Failed Kick");
            this._currentPiece.rotate(4 - dir); // Failed, unrotate.
        }
        private lock() {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new Block(0xFFFFFF, true, true));
            this.clearLines(this._currentPiece.getYVals());
            this.next();
        }

        private update(): void {
            this.updateField();
            this.updateQueue();
            this.updateHold();
        }
        private updateHold(): void {
            if (this._hold === undefined) {
                return;
            }
            this._renderer.updateHold(this._hold.getRenderShape());
        }
        private updateField(): void {
            //Update field
            let temp = this._field.getColors();
            let copyCurrent = this._currentPiece.getCopy();
            this.sonicDrop();
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = 0x888888; /// for now
            }
            this._currentPiece = copyCurrent;
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = 0xFFFFFF; /// for now
            }
            this._renderer.updateField(temp);
        }
        private updateQueue(): void {
            //Update queue
            let queue: Piece[] = this._queue.getQueue();
            let q: number[][] = [];
            for (let p of queue) {
                q.push(p.getRenderShape());
            }
            this._renderer.updateQueue(q);
        }

        private clearLines(yvals: number[]): number { //returns number of lines cleared
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

        Triggered(keyCode: number): void {
            switch (keyCode) {
                case this._controls[Inputs.CW]:
                    this.rotate(Rotations.CW);
                    break;
                case this._controls[Inputs.RIGHT]:
                    this.move(Directions.RIGHT);
                    break;
                case this._controls[Inputs.SD]:
                    this.move(Directions.DOWN);
                    break;
                case this._controls[Inputs.LEFT]:
                    this.move(Directions.LEFT);
                    break;
                case this._controls[Inputs.CCW]:
                    this.rotate(Rotations.CCW);
                    break;
                case this._controls[Inputs.CWCW]:
                    this.rotate(Rotations.CWCW);
                    break;
                case this._controls[Inputs.HD]:
                    this.hardDrop();
                    break;
                case this._controls[Inputs.HOLD]:
                    this.hold();
                    break;
            }
            this.update();//remove this and only update when needed
        }

    }
}