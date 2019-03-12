var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
var game;
// load sprites and run game when done
PIXI.loader.add('assets/textures/b.png').load(load);
function load() {
    game = new ASC.Game(8);
    ASC.InputManager.initialize();
}
var ASC;
(function (ASC) {
    //Representation of a block.
    var Block = /** @class */ (function () {
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
        function Block(color, solid, clearable) {
            if (color === void 0) { color = 0x000000; }
            if (solid === void 0) { solid = false; }
            if (clearable === void 0) { clearable = false; }
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        Object.defineProperty(Block.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "solid", {
            get: function () {
                return this._solid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "clearable", {
            get: function () {
                return this._clearable;
            },
            enumerable: true,
            configurable: true
        });
        return Block;
    }());
    ASC.Block = Block;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Rotations;
    (function (Rotations) {
        Rotations[Rotations["NONE"] = 0] = "NONE";
        Rotations[Rotations["CW"] = 1] = "CW";
        Rotations[Rotations["CWCW"] = 2] = "CWCW";
        Rotations[Rotations["CCW"] = 3] = "CCW"; //Stored CW,CWCW, CCW but for math start at 1
    })(Rotations = ASC.Rotations || (ASC.Rotations = {}));
    var Directions;
    (function (Directions) {
        Directions[Directions["UP"] = 0] = "UP";
        Directions[Directions["RIGHT"] = 1] = "RIGHT";
        Directions[Directions["DOWN"] = 2] = "DOWN";
        Directions[Directions["LEFT"] = 3] = "LEFT";
    })(Directions = ASC.Directions || (ASC.Directions = {}));
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    //Representation of a game field.
    var Field = /** @class */ (function () {
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        function Field(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        //Initialzes the field with empty blocks.
        Field.prototype.initialize = function () {
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        Field.prototype.shift = function (lines) {
            this._array.splice(0, lines * this._width);
            for (var i = 0; i < lines * this._width; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        Field.prototype.getAt = function (index) {
            return this._array[index];
        };
        Field.prototype.getColors = function () {
            var c = [];
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var i = _a[_i];
                c.push(i.color);
            }
            return c;
        };
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        Field.prototype.setBlocks = function (indices, block) {
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var i = indices_1[_i];
                this._array[i] = block;
            }
        };
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        Field.prototype.clearLineAt = function (yval) {
            this._array.splice(yval * this._width, this._width);
            for (var i = 0; i < this._width; ++i) {
                this._array.unshift(new ASC.Block());
            }
        };
        return Field;
    }());
    ASC.Field = Field;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
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
        function Game(width) {
            if (width === void 0) { width = 12; }
            this._pieces = [];
            //Inputs for the game:
            //                            Right, SD,    Left,  CW,    CCW,   180(CWCW),Hold,HD     
            this._inputs = [false, false, false, false, false, false, false, false];
            ASC.InputManager.RegisterObserver(this);
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            this._renderer = new ASC.Renderer(this._width);
            //For now:
            this._pieces.push(new ASC.Piece("T", [11, 12, 13, 17]));
            this._pieces.push(new ASC.Piece("L", [7, 12, 17, 18]));
            this._pieces.push(new ASC.Piece("Z", [11, 12, 17, 18]));
            //this._pieces.push(new Piece("a", [0, 1, 8, 13, 20, 24]))
            this._pieces.forEach(function (i) { return (i.initRotations()); });
            this.resetGame();
            app.stage.addChild(this._renderer);
        }
        Game.prototype.resetGame = function () {
            this._field = new ASC.Field(this._width);
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces); //NO bag size for now
            this._hold = undefined;
            this.next();
            this.update();
        };
        Game.prototype.next = function () {
            this._currentPiece = this._queue.getNext();
        };
        //TODO:
        //Apply kicks and rotation
        //Phases?:
        //Falling
        //Lock
        //Gravity event
        //Garbage Event
        Game.prototype.hardDrop = function () {
            var i = 0;
            while (this.checkShift(0, i)) {
                ++i;
            }
            this._currentPiece.move(ASC.Directions.DOWN, i - 1);
            this.lock();
        };
        Game.prototype.move = function (dir) {
            switch (dir) {
                case ASC.Directions.LEFT:
                    if (this.checkShift(-1, 0)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
                case ASC.Directions.RIGHT:
                    if (this.checkShift(1, 0)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
                case ASC.Directions.DOWN:
                    if (this.checkShift(0, 1)) {
                        this._currentPiece.move(dir, 1);
                    }
                    break;
            }
        };
        Game.prototype.checkShift = function (x, y) {
            var coords = this._currentPiece.getCoords(this._width);
            var yvals = this._currentPiece.getYVals();
            for (var i = 0; i < coords.length; ++i) {
                var block = this._field.getAt(coords[i] + x + y * this._width);
                if (block === undefined || //Up, Down bounds
                    yvals[i] != ~~(coords[i] / this._width) || //Left, Right wrapping bounds
                    0 - x > coords[i] % this._width || //Left bound
                    this._width - x <= coords[i] % this._width || //Right bound
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
                var sign = dir - 2; // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
            }
            this._currentPiece.rotate(4 - dir); // Failed, unrotate.
        };
        Game.prototype.lock = function () {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(0xFFFFFF, true, true));
            this.clearLines(this._currentPiece.getYVals());
            this.next();
        };
        Game.prototype.update = function () {
            var temp = this._field.getColors();
            for (var _i = 0, _a = this._currentPiece.getCoords(this._width); _i < _a.length; _i++) {
                var point = _a[_i];
                temp[point] = 0xFFFFFF; /// for now
            }
            this._renderer.updateField(temp);
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
        Game.prototype.RecieveNotification = function (keyevent, down) {
            switch (keyevent.keyCode) {
                case ASC.Keys.UP:
                    if (down) {
                        this.rotate(ASC.Rotations.CW);
                    }
                    this._inputs[Inputs.CW] = down;
                    break;
                case ASC.Keys.RIGHT:
                    if (down) {
                        this.move(ASC.Directions.RIGHT);
                    }
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case ASC.Keys.DOWN:
                    if (down) {
                        this.move(ASC.Directions.DOWN);
                    }
                    this._inputs[Inputs.SD] = down;
                    break;
                case ASC.Keys.LEFT:
                    if (down) {
                        this.move(ASC.Directions.LEFT);
                    }
                    this._inputs[Inputs.LEFT] = down;
                    break;
                case ASC.Keys.S:
                    if (down) {
                        this.rotate(ASC.Rotations.CCW);
                    }
                    this._inputs[Inputs.CCW] = down;
                    break;
                case ASC.Keys.D:
                    if (down) {
                        this.rotate(ASC.Rotations.CWCW);
                    }
                    this._inputs[Inputs.CWCW] = down;
                    break;
                case ASC.Keys.SPACE:
                    if (down) {
                        this.hardDrop();
                    }
                    this._inputs[Inputs.HD] = down;
                    break;
                case ASC.Keys.SHIFT:
                    this._inputs[Inputs.HOLD] = down;
                    break;
            }
            this.update();
        };
        return Game;
    }());
    ASC.Game = Game;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    //Don't think i need this anymore
    var GameState = /** @class */ (function () {
        function GameState() {
        }
        return GameState;
    }());
    ASC.GameState = GameState;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Keys;
    (function (Keys) {
        Keys[Keys["LEFT"] = 37] = "LEFT";
        Keys[Keys["UP"] = 38] = "UP";
        Keys[Keys["RIGHT"] = 39] = "RIGHT";
        Keys[Keys["DOWN"] = 40] = "DOWN";
        Keys[Keys["S"] = 83] = "S";
        Keys[Keys["D"] = 68] = "D";
        Keys[Keys["SPACE"] = 32] = "SPACE";
        Keys[Keys["SHIFT"] = 16] = "SHIFT";
    })(Keys = ASC.Keys || (ASC.Keys = {}));
    var InputManager = /** @class */ (function () {
        function InputManager() {
        }
        InputManager.initialize = function () {
            for (var i = 0; i < 255; ++i) {
                InputManager._keys[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        };
        InputManager.isKeyDown = function (key) {
            return InputManager._keys[key];
        };
        InputManager.onKeyDown = function (event) {
            InputManager._keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            InputManager.NotifyObservers(event, true);
            return false;
        };
        InputManager.onKeyUp = function (event) {
            InputManager._keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            InputManager.NotifyObservers(event, false);
            return false;
        };
        InputManager.RegisterObserver = function (Observer) {
            InputManager._observers.push(Observer);
        };
        InputManager.UnregisterObserver = function (Observer) {
            var index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1);
            }
            else {
                console.warn("Cannot unregister observer.");
            }
        };
        InputManager.NotifyObservers = function (keyevent, down) {
            for (var _i = 0, _a = InputManager._observers; _i < _a.length; _i++) {
                var o = _a[_i];
                o.RecieveNotification(keyevent, down);
            }
        };
        InputManager._keys = [];
        InputManager._observers = [];
        return InputManager;
    }());
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Piece = /** @class */ (function () {
        function Piece(name, shape, offset, initOrient, color) {
            if (offset === void 0) { offset = 0; }
            if (initOrient === void 0) { initOrient = 0; }
            if (color === void 0) { color = 0xFFFFFF; }
            this._shape = []; //The shape of piece (array of indecies to be filled)
            this._orientations = []; //Precomputed orientations/rotations
            this._currentOrientation = 0; //Current orientation
            this._x = 0;
            this._y = 0;
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this._x += this._offset;
        }
        Piece.prototype.initRotations = function () {
            this._orientations.push(this._shape);
            var temp = [];
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                temp.push(20 - 5 * (i % 5) + ~~(i / 5));
            }
            this._orientations.push(temp);
            temp = [];
            for (var _b = 0, _c = this._shape; _b < _c.length; _b++) {
                var i = _c[_b];
                temp.push(24 - i);
            }
            this._orientations.push(temp);
            temp = [];
            for (var _d = 0, _e = this._shape; _d < _e.length; _d++) {
                var i = _e[_d];
                temp.push(4 + 5 * (i % 5) - ~~(i / 5));
            }
            this._orientations.push(temp);
        };
        Piece.prototype.setShape = function (shape) {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            this._blockCount = shape.length;
            for (var _i = 0, shape_1 = shape; _i < shape_1.length; _i++) {
                var i = shape_1[_i];
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._blockCount = shape.length;
            this._shape = shape;
            this._orientations.push(shape);
            var cw = [];
            var ccw = [];
            var cwcw = [];
            for (var _a = 0, shape_2 = shape; _a < shape_2.length; _a++) {
                var i = shape_2[_a];
                cw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                ccw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        };
        Piece.prototype.rotate = function (dir) {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
        };
        Piece.prototype.move = function (dir, dist) {
            switch (dir) {
                case ASC.Directions.UP:
                    this._y -= dist;
                    break;
                case ASC.Directions.RIGHT:
                    this._x += dist;
                    break;
                case ASC.Directions.DOWN:
                    this._y += dist;
                    break;
                case ASC.Directions.LEFT:
                    this._x -= dist;
                    break;
            }
        };
        Piece.prototype.getCoords = function (width) {
            var c = [];
            for (var _i = 0, _a = this._orientations[this._currentOrientation]; _i < _a.length; _i++) {
                var i = _a[_i];
                var newI = (i % 5) + ~~(i / 5) * width;
                c.push(newI + this._x + this._y * width);
            }
            return c;
        };
        Piece.prototype.getYVals = function () {
            var c = [];
            for (var _i = 0, _a = this._orientations[this._currentOrientation]; _i < _a.length; _i++) {
                var i = _a[_i];
                var y = ~~(i / 5) + this._y;
                c.push(y);
            }
            return c;
        };
        Piece.prototype.getCopy = function () {
            var copy = new Piece(this._name, this._shape, this._offset, this._initialOrientation, this._color);
            copy._orientations = this._orientations;
            return copy;
        };
        return Piece;
    }());
    ASC.Piece = Piece;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var PRNG = /** @class */ (function () {
        function PRNG(seed) {
            this._seed = Math.round(seed) % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        PRNG.prototype.next = function () {
            return this._seed = this._seed * 16807 % 2147483647;
        };
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        PRNG.prototype.nextFloat = function () {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return (this.next() - 1) / 2147483646;
        };
        PRNG.prototype.shuffleArray = function (array) {
            var _a;
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(this.nextFloat() * (i + 1));
                _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
            }
        };
        return PRNG;
    }());
    ASC.PRNG = PRNG;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    ASC.NUM_PREVIEWS = 6;
    var Queue = /** @class */ (function () {
        function Queue(seed, pieces, size) {
            if (size === void 0) { size = pieces.length; }
            this._queue = [];
            this._rng = new ASC.PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        Queue.prototype.generateQueue = function () {
            if (this._queue.length < this._bagSize) {
                var tempBag_2 = [];
                while (tempBag_2.length < this._bagSize) {
                    this._bag.forEach(function (i) { return tempBag_2.push(i.getCopy()); });
                }
                for (var _i = 0, tempBag_1 = tempBag_2; _i < tempBag_1.length; _i++) {
                    var i = tempBag_1[_i];
                    this._queue.push(i);
                }
            }
        };
        Queue.prototype.getBag = function () {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
            ;
        };
        Queue.prototype.getNext = function () {
            var temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        };
        return Queue;
    }());
    ASC.Queue = Queue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Renderer = /** @class */ (function (_super) {
        __extends(Renderer, _super);
        function Renderer(width) {
            var _this = _super.call(this) || this;
            _this._size = 24;
            _this._width = width;
            _this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
            _this.initalizeSprites();
            return _this;
        }
        Renderer.prototype.initalizeSprites = function () {
            this._sprites = [];
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                var s = new PIXI.Sprite(this._texture);
                s.x = i % this._width * this._size;
                s.y = ~~(i / this._width) * this._size;
                //tint
                this.addChild(s);
                this._sprites.push(s);
            }
        };
        //Color is hex
        Renderer.prototype.updateColor = function (index, color) {
            //if (this._sprites[index].tint != color) {
            this._sprites[index].tint = color;
            //}
        };
        Renderer.prototype.updateField = function (Field) {
            for (var i = 0; i < Field.length; ++i) {
                this.updateColor(i, Field[i]);
            }
        };
        return Renderer;
    }(PIXI.Container));
    ASC.Renderer = Renderer;
})(ASC || (ASC = {}));
//# sourceMappingURL=main.js.map