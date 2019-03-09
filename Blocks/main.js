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
//let game = new Game(app);
// load sprites and run game when done
PIXI.loader.add('blocks', 'assets/textures/b.png').load( //() => game.run()
);
var ASC;
(function (ASC) {
    var Block = /** @class */ (function () {
        function Block(color, solid, clearable) {
            if (color === void 0) { color = TSE.Color.black(); }
            if (solid === void 0) { solid = false; }
            if (clearable === void 0) { clearable = false; }
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        Block.prototype.getColor = function () {
            return this._color.toArray();
        };
        return Block;
    }());
    ASC.Block = Block;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Rotations;
    (function (Rotations) {
        Rotations[Rotations["CW"] = 0] = "CW";
        Rotations[Rotations["CWCW"] = 1] = "CWCW";
        Rotations[Rotations["CCW"] = 2] = "CCW";
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
    ASC.MAX_FIELD_WIDTH = 20;
    ASC.MIN_FIELD_WIDTH = 5;
    ASC.FIELD_HEIGHT = 25;
    var Field = /** @class */ (function () {
        function Field(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
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
        Field.prototype.getArray = function () {
            return this._array;
        };
        return Field;
    }());
    ASC.Field = Field;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
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
        function Game(width, manager) {
            if (width === void 0) { width = 12; }
            if (manager === void 0) { manager = null; }
            this._pieces = [];
            //Inputs for the game:
            //                            Right, SD,    Left,  CW,    CCW,   180(CWCW),Hold,HD     
            this._inputs = [false, false, false, false, false, false, false, false];
            ASC.InputManager.RegisterObserver(this);
            this._fieldManager = manager;
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            //For now:
            this._pieces.push(new ASC.Piece("T", [11, 12, 13, 14]));
            this._pieces.push(new ASC.Piece("L", [7, 12, 17, 18]));
            this._pieces.push(new ASC.Piece("Z", [11, 12, 17, 18]));
            this.resetGame();
            this._fieldManager.voidInitArray(this._field.getArray());
        }
        Game.prototype.resetGame = function () {
            this._field = new ASC.Field(this._width);
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces); //NO bag size for now
            this._hold = undefined;
            this._currentPiece = this._queue.getNext();
        };
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
        Game.prototype.update = function () {
            var temp = this._field.getArray();
            for (var _i = 0, _a = this._currentPiece.getCoords(this._width); _i < _a.length; _i++) {
                var point = _a[_i];
                temp[point] = new ASC.Block(new TSE.Color(1, 1, 1, 1));
            }
            this._fieldManager.update(temp);
        };
        Game.prototype.RecieveNotification = function (keyevent, down) {
            switch (keyevent.keyCode) {
                case ASC.Keys.UP:
                    this._currentPiece.move(ASC.Directions.UP, 1);
                    this._inputs[Inputs.CW] = down;
                    break;
                case ASC.Keys.RIGHT:
                    this._currentPiece.move(ASC.Directions.RIGHT, 1);
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case ASC.Keys.DOWN:
                    this._currentPiece.move(ASC.Directions.DOWN, 1);
                    this._inputs[Inputs.SD] = down;
                    break;
                case ASC.Keys.LEFT:
                    this._inputs[Inputs.LEFT] = down;
                    this._currentPiece.move(ASC.Directions.LEFT, 1);
                    break;
                case ASC.Keys.S:
                    this._inputs[Inputs.CCW] = down;
                    break;
                case ASC.Keys.D:
                    this._inputs[Inputs.CWCW] = down;
                    break;
                case ASC.Keys.SPACE:
                    this._inputs[Inputs.HD] = down;
                    break;
                case ASC.Keys.SHIFT:
                    this._inputs[Inputs.HOLD] = down;
                    break;
            }
            this.update();
            //console.log(this._inputs);
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
            if (color === void 0) { color = TSE.Color.red(); }
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
            // kicks
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
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                c.push(i + this._x + this._y * width);
            }
            return c;
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
            var tempBag = this._bag.slice(0);
            while (tempBag.length < this._bagSize) {
                tempBag.concat(this._bag.slice(0));
            }
            while (this._queue.length < ASC.NUM_PREVIEWS) {
                this._rng.shuffleArray(tempBag);
                Array.prototype.push.apply(this._queue, tempBag.slice(0, this._bagSize));
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
            _this.initalizeSprites();
            _this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
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
        Renderer.prototype.updateBoard = function (board) {
            for (var i = 0; i < board.length; ++i) {
                this.updateColor(i, board[i]);
            }
        };
        return Renderer;
    }(PIXI.Container));
    ASC.Renderer = Renderer;
})(ASC || (ASC = {}));
//# sourceMappingURL=main.js.map