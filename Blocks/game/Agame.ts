namespace ASC {
    export const MAX_FIELD_WIDTH: number = 20;
    export const MIN_FIELD_WIDTH: number = 5;
    export const FIELD_HEIGHT: number = 25;
    export enum Inputs {
        RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD, SONIC, RESTART
    }
    const KICKVER = 1;
    export abstract class AGame implements ITriggerObserver {
        private _visible: boolean = true;
        protected _field: Field;
        protected _currentPiece: Piece;
        protected _hold: Piece;
        protected _queue: AQueue;
        protected _width: number
        protected _bagSize: number;
        protected _pieces: Piece[] = [];
        protected _controls: number[];
        protected _renderer: Renderer;
        protected _active: boolean = false;
        protected _seed: number;
        private _time: Stopwatch;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(
            width: number = 12, bagSize: number = 7,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new Piece("S", [7, 8, 11, 12], 2, 0x00FF00),
            new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)],
            controls: number[] = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], delay: number = 100, repeat: number = 10) {
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
            if (this._visible) {
                for (var i = RUN.app.stage.children.length - 1; i >= 0; --i) {
                    RUN.app.stage.removeChild(RUN.app.stage.children[i]);
                }
                InputManager.RegisterObserver(this);
                InputManager.RegisterKeys(this, [controls[Inputs.LEFT], controls[Inputs.RIGHT], controls[Inputs.SD]], delay, repeat);
                this._controls = controls
                this._renderer = new Renderer(this._width, "Attack");
                RUN.app.stage.addChild(this._renderer);
            }
            this._time = new Stopwatch();
        }

        public resetGame(): void {
            this._field = new Field(this._width);
            this._hold = undefined;
            this.next();
            this._active = true;
            this._time.start();
            this._renderer.updateTime((this._time.getTime()/1000).toString());
            this.update();

        }
        protected gameOver(): void {
            this._active = false;
            this.update();
        }

        protected next(): void {
            if (this._queue.hasNext()) {
                this._currentPiece = this._queue.getNext();
                if (!this.checkShift(0, 0)) {
                    this.gameOver();
                    this._renderer.updateTime("Game end");
                }
            }
            else {
                this.gameOver();
                this._renderer.updateTime("Game end");
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
            this.updateQueue();
            this._renderer.updateTime((this._time.getTime() / 1000).toString());
            this.updateHold();
        }
        private updateHold(): void {
            if (this._hold === undefined) {
                let temp = [];
                for (let i = 0; i < 25; ++i) {
                    temp.push(0x000000);
                }
                this._renderer.updateHold(temp);
                return;
            }
            this._renderer.updateHold(this._hold.getRenderShape());
        }
        private updateField(): void {
            //Update field
            let temp = this._field.getColors();
            if (this._currentPiece != undefined) {
                let copyCurrent = this._currentPiece.getCopy();
                this.sonicDrop();
                for (let point of this._currentPiece.getCoords(this._width)) {
                    temp[point] = (this._currentPiece.color & 0xfefefe) >> 1;; /// for now
                }
                this._currentPiece = copyCurrent;
                for (let point of this._currentPiece.getCoords(this._width)) {
                    temp[point] = this._currentPiece.color; /// for now
                }
                for (let i = 0; i < 5; ++i) {
                    for (let j = 0; j < 5; ++j) {

                        let index = i + this._currentPiece.xy[0] + (j + this._currentPiece.xy[1]) * this._width;
                        if (i + this._currentPiece.xy[0] >= 0 && i + this._currentPiece.xy[0] < this._width &&
                            j + this._currentPiece.xy[1] >= 0 && j + this._currentPiece.xy[1] < FIELD_HEIGHT) {
                            if (i == 2 && j == 2) {
                                temp[index] = this.darken(temp[index]);
                            }
                            else {
                                temp[index] = this.lighten(temp[index]);
                            }

                        }
                    }
                }
            }
            this._renderer.updateField(temp);
        }
        private lighten(hex: number): number {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.min(r + 50, 255);
            g = Math.min(g + 50, 255);
            b = Math.min(b + 50, 255);
            return r * 65536 + g * 256 + b;
        }
        private darken(hex: number): number {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.max(r - 50, 0);
            g = Math.max(g - 50, 0);
            b = Math.max(b - 50, 0);
            return r * 65536 + g * 256 + b;
        }
        private updateQueue(): void {
            //Update queue
            let queue: Piece[] = this._queue.getQueue();
            while (queue.length < NUM_PREVIEWS) {
                queue.push(undefined);
            }
            let q: number[][] = [];
            for (let p of queue) {
                if (p == undefined) {
                    q.push(new Array(25).fill(0));
                }
                else {
                    q.push(p.getRenderShape());
                }
            }
            this._renderer.updateQueue(q);
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
        public touchControl(code: number): void {
            if (this._active) {
                switch (code) {
                    case 0:
                        InputManager.cancelRepeat(this._controls[Inputs.RIGHT]);
                        this.move(Directions.LEFT);
                        break;
                    case 1:
                        this.move(Directions.DOWN);
                        break;
                    case 2:
                        this.move(Directions.RIGHT);
                        InputManager.cancelRepeat(this._controls[Inputs.LEFT]);
                        break;
                    case 3:

                        this.rotate(Rotations.CW);
                        break;
                    case 4:
                        this.rotate(Rotations.CWCW);
                        break;
                    case 5:
                        this.rotate(Rotations.CCW);
                        break;
                    case 6:
                        this.hardDrop();
                        break;
                    case 7:
                        this.hold();
                        break;
                    case 8:
                        this.sonicDrop();
                        break;
                }
                this.update();//remove this and only update when needed
            }
            if (code == 9) { //f4
                this.resetGame();
            }
        }
        Triggered(keyCode: number): void {
            if (this._active) {
                switch (keyCode) {
                    case this._controls[Inputs.CW]:
                        this.rotate(Rotations.CW);
                        break;
                    case this._controls[Inputs.RIGHT]:
                        this.move(Directions.RIGHT);
                        InputManager.cancelRepeat(this._controls[Inputs.LEFT]);
                        break;
                    case this._controls[Inputs.SD]:
                        this.move(Directions.DOWN);
                        break;
                    case this._controls[Inputs.LEFT]:
                        InputManager.cancelRepeat(this._controls[Inputs.RIGHT]);
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
                    case this._controls[Inputs.SONIC]:
                        this.sonicDrop();
                        break;
                }
                this.update();//remove this and only update when needed
            }
            if (keyCode == this._controls[Inputs.RESTART]) { //f4
                this.resetGame();
            }
        }
    }
}