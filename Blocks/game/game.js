var ASC;
(function (ASC) {
    //TODO:
    //Config files
    //Hosting?
    ASC.MAX_FIELD_WIDTH = 20;
    ASC.MIN_FIELD_WIDTH = 5;
    ASC.FIELD_HEIGHT = 25;
    var Inputs;
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
    var Game = /** @class */ (function () {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        function Game(width, queueSize) {
            if (width === void 0) { width = 12; }
            if (queueSize === void 0) { queueSize = 6; }
            this._pieces = [];
            ASC.InputManager.RegisterObserver(this);
            ASC.InputManager.RegisterKeys(this, [ASC.Keys.LEFT, ASC.Keys.RIGHT, ASC.Keys.DOWN], 100, 10);
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._queueSize = queueSize;
            this._renderer = new ASC.Renderer(this._width, this._queueSize);
            this._hold = undefined;
            //For now:
            this._pieces.push(new ASC.Piece("T", [7, 11, 12, 13], 2));
            this._pieces.push(new ASC.Piece("L", [8, 11, 12, 13], 2));
            this._pieces.push(new ASC.Piece("J", [6, 11, 12, 13], 2));
            this._pieces.push(new ASC.Piece("Z", [11, 12, 17, 18], 2));
            this._pieces.push(new ASC.Piece("S", [12, 13, 16, 17], 2));
            this._pieces.push(new ASC.Piece("I", [11, 12, 13, 14], 2));
            this._pieces.push(new ASC.Piece("O", [12, 13, 17, 18], 2));
            //this._pieces.push(new Piece("a", [0, 1, 8, 13, 20, 24]))
            this._pieces.forEach(function (i) { return (i.initRotations()); });
            this.resetGame();
            app.stage.addChild(this._renderer);
        }
        Game.prototype.resetGame = function () {
            this._field = new ASC.Field(this._width);
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._queueSize); //NO bag size for now
            this._hold = undefined;
            this.next();
            this.update();
        };
        Game.prototype.next = function () {
            this._currentPiece = this._queue.getNext();
        };
        //TODO:
        //Garbage Event
        Game.prototype.hold = function () {
            var _a;
            this._currentPiece.reset();
            if (this._hold === undefined) {
                this._hold = this._currentPiece;
                this.next();
                return;
            }
            _a = [this._currentPiece, this._hold], this._hold = _a[0], this._currentPiece = _a[1];
        };
        Game.prototype.hardDrop = function () {
            this.sonicDrop();
            this.lock();
        };
        Game.prototype.sonicDrop = function () {
            var i = 0;
            while (this.checkShift(0, i)) {
                ++i;
            }
            this._currentPiece.move(0, i - 1);
        };
        Game.prototype.move = function (dir) {
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
        };
        Game.prototype.checkShift = function (x, y) {
            var coords = this._currentPiece.getCoords(this._width);
            var yvals = this._currentPiece.getYVals();
            for (var i = 0; i < coords.length; ++i) {
                var block = this._field.getAt(coords[i] + x + y * this._width);
                if (block == null || //Up, Down bounds
                    yvals[i] != ~~((coords[i] + x) / this._width) || //Left, Right wrapping bounds
                    block.solid //Colliding with a block
                ) {
                    return false;
                }
            }
            return true;
        };
        Game.prototype.rotate = function (dir) {
            this._currentPiece.rotate(dir);
            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== ASC.Rotations.CWCW) { //No 180 kicks
                var sign = -(dir - 2); // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
                for (var x = 0; x < 8; ++x) {
                    var xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (var i = 0; i < (x + 1) * 2; ++i) { //tune this
                        var ykicks = Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4);
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
        };
        Game.prototype.lock = function () {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(0xFFFFFF, true, true));
            this.clearLines(this._currentPiece.getYVals());
            this.next();
        };
        Game.prototype.update = function () {
            this.updateField();
            this.updateQueue();
            this.updateHold();
        };
        Game.prototype.updateHold = function () {
            if (this._hold === undefined) {
                return;
            }
            this._renderer.updateHold(this._hold.getRenderShape());
        };
        Game.prototype.updateField = function () {
            //Update field
            var temp = this._field.getColors();
            var copyCurrent = this._currentPiece.getCopy();
            this.sonicDrop();
            for (var _i = 0, _a = this._currentPiece.getCoords(this._width); _i < _a.length; _i++) {
                var point = _a[_i];
                temp[point] = 0x888888; /// for now
            }
            this._currentPiece = copyCurrent;
            for (var _b = 0, _c = this._currentPiece.getCoords(this._width); _b < _c.length; _b++) {
                var point = _c[_b];
                temp[point] = 0xFFFFFF; /// for now
            }
            this._renderer.updateField(temp);
        };
        Game.prototype.updateQueue = function () {
            //Update queue
            var queue = this._queue.getQueue();
            var q = [];
            for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
                var p = queue_1[_i];
                q.push(p.getRenderShape());
            }
            this._renderer.updateQueue(q);
        };
        Game.prototype.clearLines = function (yvals) {
            var lines = 0;
            yvals.sort(function (a, b) { return a - b; }); //sort and remove backwards
            for (var _i = 0, yvals_1 = yvals; _i < yvals_1.length; _i++) { //checks only placed rows.
                var y = yvals_1[_i];
                for (var i = 0; i < this._width; i++) {
                    var block = this._field.getAt(y * this._width + i);
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
        };
        Game.prototype.Triggered = function (keyCode) {
            switch (keyCode) {
                case ASC.Keys.UP:
                    this.rotate(ASC.Rotations.CW);
                    break;
                case ASC.Keys.RIGHT:
                    this.move(ASC.Directions.RIGHT);
                    break;
                case ASC.Keys.DOWN:
                    this.move(ASC.Directions.DOWN);
                    break;
                case ASC.Keys.LEFT:
                    this.move(ASC.Directions.LEFT);
                    break;
                case ASC.Keys.S:
                    this.rotate(ASC.Rotations.CCW);
                    break;
                case ASC.Keys.D:
                    this.rotate(ASC.Rotations.CWCW);
                    break;
                case ASC.Keys.SPACE:
                    this.hardDrop();
                    break;
                case ASC.Keys.SHIFT:
                    this.hold();
                    break;
            }
            this.update(); //remove this and only update when needed
        };
        return Game;
    }());
    ASC.Game = Game;
})(ASC || (ASC = {}));
//# sourceMappingURL=game.js.map