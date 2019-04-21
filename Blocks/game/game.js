var ASC;
(function (ASC) {
    //TODO:
    //Score
    ASC.MAX_FIELD_WIDTH = 20;
    ASC.MIN_FIELD_WIDTH = 5;
    ASC.FIELD_HEIGHT = 25;
    const TIMELIMIT = 60;
    let Inputs;
    (function (Inputs) {
        Inputs[Inputs["RIGHT"] = 0] = "RIGHT";
        Inputs[Inputs["SD"] = 1] = "SD";
        Inputs[Inputs["LEFT"] = 2] = "LEFT";
        Inputs[Inputs["CW"] = 3] = "CW";
        Inputs[Inputs["CCW"] = 4] = "CCW";
        Inputs[Inputs["CWCW"] = 5] = "CWCW";
        Inputs[Inputs["HOLD"] = 6] = "HOLD";
        Inputs[Inputs["HD"] = 7] = "HD";
    })(Inputs || (Inputs = {}));
    class Game {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width = 12, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], controls = [39, 40, 37, 38, 83, 68, 16, 32], staticQueue = false, order = null, clearable = [], delay = 100, repeat = 10) {
            this._pieces = [];
            this._active = false;
            this._progress = 0;
            for (var i = RUN.app.stage.children.length - 1; i >= 0; --i) {
                RUN.app.stage.removeChild(RUN.app.stage.children[i]);
            }
            ;
            if (delay < 1) {
                throw new Error("Invalid Delay");
            }
            if (repeat < 1) {
                throw new Error("Invalid Repeat");
            }
            ASC.InputManager.RegisterObserver(this);
            ASC.InputManager.RegisterKeys(this, [controls[Inputs.LEFT], controls[Inputs.RIGHT], controls[Inputs.SD]], delay, repeat);
            this._controls = controls;
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._bagSize = bagSize;
            this._order = order;
            this._static = staticQueue;
            this._map = clearable;
            this._renderer = new ASC.Renderer(this._width, "Attack");
            //Verify piece offset.
            for (let p of pieces) {
                p.validateOffset(this._width);
            }
            this._pieces = pieces;
            this._pieces.forEach((i) => (i.initRotations()));
            this._attack = new ASC.AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
            this.resetGame();
            RUN.app.stage.addChild(this._renderer);
        }
        resetGame() {
            this._field = new ASC.Field(this._width);
            this._hold = undefined;
            if (this._static) {
                this._field.setBlocks(this._map, new ASC.Block(0xDDDDDD, true, true));
                this._queue = new ASC.StaticQueue(this._pieces, this._order);
            }
            else {
                this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._bagSize);
            }
            this.next();
            this._active = true;
            this._progress = 0;
            this.update();
            this._renderer.updateTime("new game haha :)");
        }
        tick() {
            this.updateTime();
        }
        gameOver() {
            this._active = false;
            this.updateTime();
            //this._timer.stop();
        }
        next() {
            this._currentPiece = this._queue.getNext();
            if (this._currentPiece == undefined || !this.checkShift(0, 0)) {
                this.gameOver();
                this._renderer.updateTime("Game end");
            }
        }
        hold() {
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
        hardDrop() {
            this.sonicDrop();
            this.lock();
        }
        sonicDrop() {
            let i = 0;
            while (this.checkShift(0, i)) {
                ++i;
            }
            this._currentPiece.move(0, i - 1);
        }
        move(dir) {
            switch (dir) {
                case ASC.Directions.LEFT:
                    if (this.checkShift(-1, 0)) {
                        this._currentPiece.move(-1, 0);
                    }
                    break;
                case ASC.Directions.RIGHT:
                    if (this.checkShift(1, 0)) {
                        this._currentPiece.move(1, 0);
                    }
                    break;
                case ASC.Directions.DOWN:
                    if (this.checkShift(0, 1)) {
                        this._currentPiece.move(0, 1);
                    }
                    break;
            }
        }
        checkShift(x, y) {
            let coords = this._currentPiece.getCoords(this._width);
            let yvals = this._currentPiece.getYVals();
            for (let i = 0; i < coords.length; ++i) {
                let block = this._field.getAt(coords[i] + x + y * this._width);
                if (block == null || //Up, Down bounds
                    yvals[i] != ~~((coords[i] + x) / this._width) || //Left, Right wrapping bounds
                    block.solid //Colliding with a block
                ) {
                    return false;
                }
            }
            return true;
        }
        rotate(dir) {
            this._currentPiece.rotate(dir);
            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== ASC.Rotations.CWCW) { //No 180 kicks
                let sign = -(dir - 2); // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
                console.log("Trying to kick:");
                for (let x = 0; x < 8; ++x) {
                    let xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (let i = 0; i < (x + 1) * 2; ++i) { //tune this
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
        checkPC() {
            for (let i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                if (this._field.getAt(i).clearable && this._field.getAt(i).solid) {
                    return false;
                }
            }
            return true;
        }
        checkImmobile() {
            return !(this.checkShift(0, 1) ||
                this.checkShift(0, -1) ||
                this.checkShift(1, 0) ||
                this.checkShift(-1, 0));
        }
        lock() {
            let spin = this.checkImmobile();
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(this._currentPiece.color, true, true));
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
        update() {
            this.updateField();
            this.updateQueue();
            this.updateHold();
            this.updateProgress();
        }
        updateHold() {
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
        updateField() {
            //Update field
            let temp = this._field.getColors();
            let copyCurrent = this._currentPiece.getCopy();
            this.sonicDrop();
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = (this._currentPiece.color & 0xfefefe) >> 1;
                ; /// for now
            }
            this._currentPiece = copyCurrent;
            for (let point of this._currentPiece.getCoords(this._width)) {
                temp[point] = this._currentPiece.color; /// for now
            }
            this._renderer.updateField(temp);
        }
        updateQueue() {
            //Update queue
            let queue = this._queue.getQueue();
            while (queue.length < ASC.NUM_PREVIEWS) {
                queue.push(undefined);
            }
            let q = [];
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
        updateProgress() {
            this._renderer.updateProgress(this._progress.toString());
        }
        updateTime() {
            this._renderer.updateTime("Timer off for now :)");
            //this._renderer.updateTime((this._timer.elapsed / 1000).toString());
        }
        clearLines(yvals) {
            let lines = 0;
            yvals.sort(function (a, b) { return a - b; }); //sort and remove backwards
            for (let y of yvals) { //checks only placed rows.
                for (let i = 0; i < this._width; i++) {
                    let block = this._field.getAt(y * this._width + i);
                    if (!block.solid || !block.clearable) {
                        break;
                    }
                    if (i == this._width - 1) { // Loop ends/ also this sucks
                        ++lines;
                        this._field.clearLineAt(y);
                    }
                } //re move rows
            }
            return lines;
        }
        touchControl(code) {
            if (this._active) {
                switch (code) {
                    case 0:
                        ASC.InputManager.cancelRepeat(this._controls[Inputs.RIGHT]);
                        this.move(ASC.Directions.LEFT);
                        break;
                    case 1:
                        this.move(ASC.Directions.DOWN);
                        break;
                    case 2:
                        this.move(ASC.Directions.RIGHT);
                        ASC.InputManager.cancelRepeat(this._controls[Inputs.LEFT]);
                        break;
                    case 3:
                        this.rotate(ASC.Rotations.CW);
                        break;
                    case 4:
                        this.rotate(ASC.Rotations.CWCW);
                        break;
                    case 5:
                        this.rotate(ASC.Rotations.CCW);
                        break;
                    case 6:
                        this.hardDrop();
                        break;
                    case 7:
                        this.hold();
                        break;
                }
                this.update(); //remove this and only update when needed
            }
        }
        Triggered(keyCode) {
            if (this._active) {
                switch (keyCode) {
                    case this._controls[Inputs.CW]:
                        this.rotate(ASC.Rotations.CW);
                        break;
                    case this._controls[Inputs.RIGHT]:
                        this.move(ASC.Directions.RIGHT);
                        ASC.InputManager.cancelRepeat(this._controls[Inputs.LEFT]);
                        break;
                    case this._controls[Inputs.SD]:
                        this.move(ASC.Directions.DOWN);
                        break;
                    case this._controls[Inputs.LEFT]:
                        ASC.InputManager.cancelRepeat(this._controls[Inputs.RIGHT]);
                        this.move(ASC.Directions.LEFT);
                        break;
                    case this._controls[Inputs.CCW]:
                        this.rotate(ASC.Rotations.CCW);
                        break;
                    case this._controls[Inputs.CWCW]:
                        this.rotate(ASC.Rotations.CWCW);
                        break;
                    case this._controls[Inputs.HD]:
                        this.hardDrop();
                        break;
                    case this._controls[Inputs.HOLD]:
                        this.hold();
                        break;
                }
                this.update(); //remove this and only update when needed
            }
            if (keyCode === 115) { //f4
                this.resetGame();
            }
        }
    }
    ASC.Game = Game;
})(ASC || (ASC = {}));
