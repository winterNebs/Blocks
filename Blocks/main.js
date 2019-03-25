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
var configText = prompt("Enter Config Data (Check out the discord for more info: https://discord.gg/GjScWEh)", "{\"width\": 10,\"pieces\":[[\"T\", [7, 11, 12, 13], 2],[\"L\", [8, 11, 12, 13], 2],[\"J\", [6, 11, 12, 13], 2],[\"Z\", [11, 12, 17, 18], 2],[\"S\", [12, 13, 16, 17], 2],\t[\"I\", [11, 12, 13, 14], 2],\t[\"O\", [12, 13, 17, 18], 2]],\"controls\": [39, 40, 37, 38, 83, 68, 16, 32],\"delay\": 100,\"repeat\": 10,\"queueSize\": 7}");
if (configText == null || configText == "") {
    configText = "{\"width\": 10,\"pieces\":[[\"T\", [7, 11, 12, 13], 2],[\"L\", [8, 11, 12, 13], 2],[\"J\", [6, 11, 12, 13], 2],[\"Z\", [11, 12, 17, 18], 2],[\"S\", [12, 13, 16, 17], 2],\t[\"I\", [11, 12, 13, 14], 2],\t[\"O\", [12, 13, 17, 18], 2]],\"controls\": [39, 40, 37, 38, 83, 68, 16, 32],\"delay\": 100,\"repeat\": 10,\"queueSize\": 7}";
}
var app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
document.body.appendChild(app.view);
var game;
var config;
PIXI.loader.add('assets/textures/b.png').load(load);
function load() {
    try {
        config = ASC.Config.fromText(configText);
    }
    catch (err) {
        alert("Something went wrong, using default config: " + err.message);
        config = ASC.Config.fromText("{\"width\": 10,\"pieces\":[[\"T\", [7, 11, 12, 13], 2],[\"L\", [8, 11, 12, 13], 2],[\"J\", [6, 11, 12, 13], 2],[\"Z\", [11, 12, 17, 18], 2],[\"S\", [12, 13, 16, 17], 2],\t[\"I\", [11, 12, 13, 14], 2],\t[\"O\", [12, 13, 17, 18], 2]],\"controls\": [39, 40, 37, 38, 83, 68, 16, 32],\"delay\": 100,\"repeat\": 10,\"queueSize\": 7}");
    }
    game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, config._delay, config._repeat);
    ASC.InputManager.initialize();
}
var ASC;
(function (ASC) {
    var Config = (function () {
        function Config(w, p, c, d, r, b) {
            this._controls = [];
            this._width = w;
            this._bagSize = b;
            this._pieces = p;
            this._controls = c;
            this._delay = d;
            this._repeat = r;
        }
        Config.fromText = function (input) {
            var cfg = JSON.parse(input);
            var ps = [];
            for (var _i = 0, _a = cfg.pieces; _i < _a.length; _i++) {
                var i = _a[_i];
                ps.push(new ASC.Piece(i[0], i[1], i[2]));
            }
            var config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        };
        return Config;
    }());
    ASC.Config = Config;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Rotations;
    (function (Rotations) {
        Rotations[Rotations["NONE"] = 0] = "NONE";
        Rotations[Rotations["CW"] = 1] = "CW";
        Rotations[Rotations["CWCW"] = 2] = "CWCW";
        Rotations[Rotations["CCW"] = 3] = "CCW";
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
    var Field = (function () {
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
        Field.prototype.setBlocks = function (indices, block) {
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var i = indices_1[_i];
                this._array[i] = block;
            }
        };
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
    var Game = (function () {
        function Game(width, bagSize, pieces, controls, delay, repeat) {
            if (width === void 0) { width = 12; }
            if (bagSize === void 0) { bagSize = 6; }
            if (pieces === void 0) { pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2), new ASC.Piece("L", [8, 11, 12, 13], 2), new ASC.Piece("J", [6, 11, 12, 13], 2),
                new ASC.Piece("Z", [11, 12, 17, 18], 2), new ASC.Piece("S", [12, 13, 16, 17], 2), new ASC.Piece("I", [11, 12, 13, 14], 2), new ASC.Piece("O", [12, 13, 17, 18], 2)]; }
            if (controls === void 0) { controls = [39, 40, 37, 38, 83, 68, 16, 32]; }
            if (delay === void 0) { delay = 100; }
            if (repeat === void 0) { repeat = 10; }
            this._pieces = [];
            this._active = false;
            this._progress = 0;
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
            this._renderer = new ASC.Renderer(this._width, "Lines");
            this._pieces = pieces;
            this._pieces.forEach(function (i) { return (i.initRotations()); });
            this.resetGame();
            app.stage.addChild(this._renderer);
        }
        Game.prototype.resetGame = function () {
            this._field = new ASC.Field(this._width);
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._bagSize);
            this._hold = undefined;
            this.next();
            this._active = true;
            this.update();
        };
        Game.prototype.next = function () {
            this._currentPiece = this._queue.getNext();
            if (!this.checkShift(0, 0)) {
                this._active = false;
                console.log("Game end");
                this.resetGame();
            }
        };
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
                if (block == null ||
                    yvals[i] != ~~((coords[i] + x) / this._width) ||
                    block.solid) {
                    return false;
                }
            }
            return true;
        };
        Game.prototype.rotate = function (dir) {
            this._currentPiece.rotate(dir);
            if (this.checkShift(0, 0)) {
                return;
            }
            if (dir !== ASC.Rotations.CWCW) {
                var sign = -(dir - 2);
                console.log("Trying to kick:");
                for (var x = 0; x < 8; ++x) {
                    var xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (var i = 0; i < (x + 1) * 2; ++i) {
                        var ykicks = (Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4));
                        console.log(xkicks, ykicks);
                        if (this.checkShift(xkicks, ykicks)) {
                            this._currentPiece.move(xkicks, ykicks);
                            return;
                        }
                    }
                }
            }
            console.log("Failed Kick.");
            this._currentPiece.rotate(4 - dir);
        };
        Game.prototype.checkPC = function () {
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                if (this._field.getAt(i).clearable && this._field.getAt(i).solid) {
                    return false;
                }
            }
            return true;
        };
        Game.prototype.checkImmobile = function () {
            return !(this.checkShift(0, 1) ||
                this.checkShift(0, -1) ||
                this.checkShift(1, 0) ||
                this.checkShift(-1, 0));
        };
        Game.prototype.lock = function () {
            if (this.checkImmobile()) {
                console.log("spin");
            }
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(0xFFFFFF, true, true));
            var cleared = this.clearLines(this._currentPiece.getYVals());
            this._progress += cleared;
            if (cleared > 0) {
                console.log(this.checkPC());
            }
            this.next();
        };
        Game.prototype.update = function () {
            this.updateField();
            this.updateQueue();
            this.updateHold();
            this.updateProgress();
        };
        Game.prototype.updateHold = function () {
            if (this._hold === undefined) {
                return;
            }
            this._renderer.updateHold(this._hold.getRenderShape());
        };
        Game.prototype.updateField = function () {
            var temp = this._field.getColors();
            var copyCurrent = this._currentPiece.getCopy();
            this.sonicDrop();
            for (var _i = 0, _a = this._currentPiece.getCoords(this._width); _i < _a.length; _i++) {
                var point = _a[_i];
                temp[point] = 0x888888;
            }
            this._currentPiece = copyCurrent;
            for (var _b = 0, _c = this._currentPiece.getCoords(this._width); _b < _c.length; _b++) {
                var point = _c[_b];
                temp[point] = 0xFFFFFF;
            }
            this._renderer.updateField(temp);
        };
        Game.prototype.updateQueue = function () {
            var queue = this._queue.getQueue();
            var q = [];
            for (var _i = 0, queue_1 = queue; _i < queue_1.length; _i++) {
                var p = queue_1[_i];
                q.push(p.getRenderShape());
            }
            this._renderer.updateQueue(q);
        };
        Game.prototype.updateProgress = function () {
            this._renderer.updateProgress(this._progress.toString());
        };
        Game.prototype.clearLines = function (yvals) {
            var lines = 0;
            yvals.sort(function (a, b) { return a - b; });
            for (var _i = 0, yvals_1 = yvals; _i < yvals_1.length; _i++) {
                var y = yvals_1[_i];
                for (var i = 0; i < this._width; i++) {
                    var block = this._field.getAt(y * this._width + i);
                    if (!block.solid || !block.clearable) {
                        break;
                    }
                    if (i == this._width - 1) {
                        ++lines;
                        this._field.clearLineAt(y);
                    }
                }
            }
            return lines;
        };
        Game.prototype.Triggered = function (keyCode) {
            if (this._active) {
                switch (keyCode) {
                    case this._controls[Inputs.CW]:
                        this.rotate(ASC.Rotations.CW);
                        break;
                    case this._controls[Inputs.RIGHT]:
                        this.move(ASC.Directions.RIGHT);
                        break;
                    case this._controls[Inputs.SD]:
                        this.move(ASC.Directions.DOWN);
                        break;
                    case this._controls[Inputs.LEFT]:
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
                this.update();
            }
        };
        return Game;
    }());
    ASC.Game = Game;
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
    var Key = (function () {
        function Key(code, delay, rate) {
            if (delay === void 0) { delay = 100; }
            if (rate === void 0) { rate = 20; }
            this._pressed = false;
            this._listeners = [];
            this._code = code;
            this._delay = delay;
            this._rate = rate;
        }
        Key.prototype.onPress = function () {
            this._pressed = true;
            this._timeout = setTimeout(this.activate.bind(this), this._delay);
        };
        Key.prototype.activate = function () {
            this._interval = setInterval(this.repeat.bind(this), this._rate);
        };
        Key.prototype.repeat = function () {
            for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
                var l = _a[_i];
                l.Triggered(this._code);
            }
        };
        Key.prototype.onRelease = function () {
            this._pressed = false;
            clearTimeout(this._timeout);
            clearInterval(this._interval);
        };
        Key.prototype.registerTrigger = function (t) {
            this._listeners.push(t);
        };
        Object.defineProperty(Key.prototype, "code", {
            get: function () {
                return this._code;
            },
            enumerable: true,
            configurable: true
        });
        return Key;
    }());
    var InputManager = (function () {
        function InputManager() {
        }
        InputManager.initialize = function () {
            for (var i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        };
        InputManager.onKeyDown = function (event) {
            if (InputManager._keyCodes[event.keyCode] !== true) {
                InputManager.NotifyObservers(event.keyCode);
                InputManager._keyCodes[event.keyCode] = true;
                if (InputManager._keys.length > 0) {
                    for (var _i = 0, _a = InputManager._keys; _i < _a.length; _i++) {
                        var k = _a[_i];
                        if (k.code === event.keyCode) {
                            k.onPress();
                        }
                    }
                }
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        InputManager.onKeyUp = function (event) {
            InputManager._keyCodes[event.keyCode] = false;
            if (InputManager._keys.length > 0) {
                for (var _i = 0, _a = InputManager._keys; _i < _a.length; _i++) {
                    var k = _a[_i];
                    if (k.code === event.keyCode) {
                        k.onRelease();
                    }
                }
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        InputManager.RegisterKeys = function (Observer, keyCodes, delay, repeat) {
            for (var _i = 0, keyCodes_1 = keyCodes; _i < keyCodes_1.length; _i++) {
                var i = keyCodes_1[_i];
                InputManager._keys.push(new Key(i, delay, repeat));
                InputManager._keys[InputManager._keys.length - 1].registerTrigger(Observer);
            }
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
        InputManager.NotifyObservers = function (keyevent) {
            for (var _i = 0, _a = InputManager._observers; _i < _a.length; _i++) {
                var o = _a[_i];
                o.Triggered(keyevent);
            }
        };
        InputManager._keys = [];
        InputManager._keyCodes = [];
        InputManager._observers = [];
        return InputManager;
    }());
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Block = (function () {
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
    var Piece = (function () {
        function Piece(name, shape, offset, initOrient, color) {
            if (offset === void 0) { offset = 0; }
            if (initOrient === void 0) { initOrient = 0; }
            if (color === void 0) { color = 0xFFFFFF; }
            this._shape = [];
            this._orientations = [];
            this._currentOrientation = 0;
            this._x = 0;
            this._y = 0;
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this.reset();
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
                cw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                ccw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        };
        Piece.prototype.rotate = function (dir) {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
        };
        Piece.prototype.move = function (x, y) {
            this._x += x;
            this._y += y;
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
        Piece.prototype.reset = function () {
            this._currentOrientation = this._initialOrientation;
            this._x = this._offset;
            this._y = 0;
        };
        Piece.prototype.getCopy = function () {
            var copy = new Piece(this._name, this._shape, this._offset, this._initialOrientation, this._color);
            copy._orientations = this._orientations;
            copy._x = this._x;
            copy._y = this._y;
            copy._currentOrientation = this._currentOrientation;
            return copy;
        };
        Piece.prototype.getRenderShape = function () {
            var temp = [];
            for (var i = 0; i < 25; ++i) {
                temp.push(0x000000);
            }
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                temp[i] = 0xFFFFFF;
            }
            return temp;
        };
        Object.defineProperty(Piece.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Piece;
    }());
    ASC.Piece = Piece;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var PRNG = (function () {
        function PRNG(seed) {
            this._seed = Math.round(seed) % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }
        PRNG.prototype.next = function () {
            return this._seed = this._seed * 16807 % 2147483647;
        };
        PRNG.prototype.nextFloat = function () {
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
    var Queue = (function () {
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
                this._rng.shuffleArray(tempBag_2);
                for (var _i = 0, tempBag_1 = tempBag_2; _i < tempBag_1.length; _i++) {
                    var i = tempBag_1[_i];
                    this._queue.push(i);
                }
            }
        };
        Queue.prototype.getQueue = function () {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
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
    var FIELD_SIZE = 24;
    var SMALL_SIZE = 10;
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(width, progress) {
            var _this = _super.call(this) || this;
            _this._queue = [];
            _this._field = new ASC.RenderGrid(width, ASC.FIELD_HEIGHT, FIELD_SIZE, SMALL_SIZE * 5);
            _this.addChild(_this._field);
            for (var i = 0; i < ASC.NUM_PREVIEWS; ++i) {
                _this._queue.push(new ASC.RenderGrid(5, 5, 10, width * FIELD_SIZE + SMALL_SIZE * 5, 10 * 5 * i));
                _this.addChild(_this._queue[i]);
            }
            _this._hold = new ASC.RenderGrid(5, 5, 10);
            _this.addChild(_this._hold);
            _this._progressText = progress;
            _this._progress = new PIXI.Text(progress + "\n", { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
            _this._progress.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            _this._progress.y = SMALL_SIZE * 5 * ASC.NUM_PREVIEWS + 10;
            _this.addChild(_this._progress);
            return _this;
        }
        Renderer.prototype.updateField = function (Field) {
            this._field.updateGrid(Field);
        };
        Renderer.prototype.updateQueue = function (q) {
            for (var i = 0; i < q.length; ++i) {
                this._queue[i].updateGrid(q[i]);
            }
        };
        Renderer.prototype.updateHold = function (p) {
            this._hold.updateGrid(p);
        };
        Renderer.prototype.updateProgress = function (t) {
            this._progress.text = this._progressText + "\n" + t;
        };
        return Renderer;
    }(PIXI.Container));
    ASC.Renderer = Renderer;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var RenderGrid = (function (_super) {
        __extends(RenderGrid, _super);
        function RenderGrid(width, height, size, x, y) {
            if (size === void 0) { size = 24; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this._width = width;
            _this._height = height;
            _this._size = size;
            _this._x = x;
            _this._y = y;
            _this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
            _this.initalizeSprites();
            return _this;
        }
        RenderGrid.prototype.initalizeSprites = function () {
            this._sprites = [];
            for (var i = 0; i < this._width * this._height; ++i) {
                var s = new PIXI.Sprite(this._texture);
                s.height = this._size;
                s.width = this._size;
                s.x = i % this._width * this._size + this._x;
                s.y = ~~(i / this._width) * this._size + this._y;
                s.tint = 0x000000;
                this.addChild(s);
                this._sprites.push(s);
            }
        };
        RenderGrid.prototype.updateColor = function (index, color) {
            this._sprites[index].tint = color;
        };
        RenderGrid.prototype.updateGrid = function (Field) {
            for (var i = 0; i < Field.length; ++i) {
                this.updateColor(i, Field[i]);
            }
        };
        return RenderGrid;
    }(PIXI.Container));
    ASC.RenderGrid = RenderGrid;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var CLEAR = -1;
    var SPIN = 2;
    var AttackTable = (function () {
        function AttackTable() {
        }
        return AttackTable;
    }());
    ASC.AttackTable = AttackTable;
})(ASC || (ASC = {}));
//# sourceMappingURL=main.js.map