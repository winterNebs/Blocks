namespace ASC {
    //TODO:
    //Score
    export const MAX_FIELD_WIDTH: number = 20;
    export const MIN_FIELD_WIDTH: number = 5;
    export const FIELD_HEIGHT: number = 25;
    const TIMELIMIT: number = 60;
    enum Inputs {
        RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
    }
    export class Game implements ITriggerObserver {
        private _field: Field;
        private _map: number[];
        private _currentPiece: Piece;
        private _hold: Piece;
        private _queue: IQueue;
        private _width: number
        private _bagSize: number;
        private _pieces: Piece[] = [];
        private _controls: number[];
        private _renderer: Renderer;
        private _active: boolean = false;
        private _progress: number = 0;
        private _attack: AttackTable;
        private _order: number[];
        private _static: boolean;
        private _timer: Timer;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(
            width: number = 12, bagSize: number = 6,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)],
            controls: number[] = [39, 40, 37, 38, 83, 68, 16, 32],
            staticQueue: boolean = false, order: number[] = null, clearable: number[] = [],
            delay: number = 100, repeat: number = 10) {
            for (var i = RUN.app.stage.children.length - 1; i >= 0; --i) {
                RUN.app.stage.removeChild(RUN.app.stage.children[i]);
            };

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
            this._bagSize = bagSize;
            this._order = order;
            this._static = staticQueue;
            this._map = clearable;
            this._renderer = new Renderer(this._width, "Attack");
            //Verify piece offset.
            for (let p of pieces) {
                p.validateOffset(this._width);
            }
            this._pieces = pieces;
            this._pieces.forEach((i) => (i.initRotations()));
            this._attack = new AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
            this.resetGame();
            RUN.app.stage.addChild(this._renderer);
        }

        public resetGame(): void {
            this._field = new Field(this._width);
            this._hold = undefined;
            if (this._static) {
                this._field.setBlocks(this._map, new Block(0xDDDDDD, true, true));
                this._queue = new StaticQueue(this._pieces, this._order);
            }
            else {
                this._queue = new Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._bagSize);
            }
            this.next();
            this._active = true;
            this._progress = 0;
            this.update();
        }
        private tick(): void {
            this.updateTime();
        }
        private gameOver(): void {
            this._active = false;
            this.updateTime();
            //this._timer.stop();

        }

        private next(): void {
            this._currentPiece = this._queue.getNext();
            if (this._currentPiece == undefined || !this.checkShift(0, 0)) {
                this.gameOver();
                this._renderer.updateTime("Game end");
            }
        }
        private hold(): void {
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
                console.log("Trying to kick:")
                for (let x = 0; x < 8; ++x) {
                    let xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (let i = 0; i < (x + 1) * 2; ++i) {//tune this
                        let ykicks = (Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4));
                        console.log(xkicks, ykicks);
                        if (this.checkShift(xkicks, ykicks)) {
                            this._currentPiece.move(xkicks, ykicks);
                            return; //successful kick
                        }
                    }
                }

            }
            console.log("Failed Kick.");
            this._currentPiece.rotate(4 - dir); // Failed, unrotate.
        }
        private checkPC(): boolean {
            for (let i = 0; i < this._width * FIELD_HEIGHT; ++i) {
                if (this._field.getAt(i).clearable && this._field.getAt(i).solid) {
                    return false
                }
            }
            return true;
        }

        private checkImmobile(): boolean {
            return !(this.checkShift(0, 1) ||
                this.checkShift(0, -1) ||
                this.checkShift(1, 0) ||
                this.checkShift(-1, 0));
        }

        private lock() {
            let spin = this.checkImmobile();
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new Block(this._currentPiece.color, true, true));
            let cleared = this.clearLines(this._currentPiece.getYVals());

            if (cleared > 0) {
                if (spin) {
                    this._progress += this._attack.spin(cleared);
                }
                else {
                    this._progress += this._attack.clear(cleared);
                }
                if (this.checkPC()) {
                    this._progress += this._attack.perfectClear(cleared);
                    if (this._static) {
                        this.gameOver();
                        this._renderer.updateTime("You Win");
                    }
                }
            }
            this.next();
        }

        private update(): void {
            this.updateField();
            this.updateQueue();
            this.updateHold();
            this.updateProgress();
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
            let copyCurrent = this._currentPiece.getCopy();
            this.sonicDrop();
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = (this._currentPiece.color & 0xfefefe) >> 1;; /// for now
            }
            this._currentPiece = copyCurrent;
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = this._currentPiece.color; /// for now
            }
            this._renderer.updateField(temp);
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
        private updateProgress(): void {
            this._renderer.updateProgress(this._progress.toString());
        }
        private updateTime(): void {
            this._renderer.updateTime("Timer off for now :)");
            //this._renderer.updateTime((this._timer.elapsed / 1000).toString());
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
                }
                this.update();//remove this and only update when needed
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
                }
                this.update();//remove this and only update when needed
            }
            if (keyCode === 115) { //f4
                this.resetGame();
            }
        }
    }
}