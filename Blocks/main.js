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
var app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
app.view.setAttribute('tabindex', '0');
document.body.onclick = function () {
    ASC.InputManager.setFocus(document.activeElement == app.view);
};
PIXI.loader.add('assets/textures/b.png').load(load);
document.body.appendChild(app.view);
var game;
function startGame(config) {
    try {
        game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, false, [], [], config._delay, config._repeat);
    }
    catch (err) {
        alert("Error in config: " + err);
        game = new ASC.Game();
    }
    app.view.focus();
}
function load() {
    game = new ASC.Game();
    ASC.InputManager.initialize();
    var discord = document.createElement("a");
    discord.setAttribute("href", "https://discord.gg/GjScWEh");
    discord.innerText = "discord";
    document.body.appendChild(discord);
    var newGameButton = document.createElement("button");
    newGameButton.innerText = "New Game";
    newGameButton.onclick = function () { return (game.resetGame()); };
    document.body.appendChild(newGameButton);
}
var D;
(function (D) {
    var Drag = (function () {
        function Drag() {
        }
        Drag.init = function () {
            document.body.onmousedown = function () {
                Drag.mouseDown = true;
            };
            document.body.onmouseup = function () {
                Drag.mouseDown = false;
            };
            document.body.onmouseleave = function () {
                Drag.mouseDown = false;
            };
        };
        Drag.mouseDown = false;
        Drag.lastState = false;
        return Drag;
    }());
    D.Drag = Drag;
})(D || (D = {}));
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
                ps.push(new ASC.Piece(i[0], i[1], i[2], Number("0x" + i[3]), 0));
            }
            var config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        };
        Config.pieceFromText = function (input) {
            var p = JSON.parse(input);
            var ps = [];
            for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
                var i = p_1[_i];
                ps.push(new ASC.Piece(i[0], i[1], i[2], Number("0x" + i[3]), 0));
            }
            return ps;
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
    var TIMELIMIT = 60;
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
        function Game(width, bagSize, pieces, controls, staticQueue, order, clearable, delay, repeat) {
            if (width === void 0) { width = 12; }
            if (bagSize === void 0) { bagSize = 6; }
            if (pieces === void 0) { pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
                new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
                new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)]; }
            if (controls === void 0) { controls = [39, 40, 37, 38, 83, 68, 16, 32]; }
            if (staticQueue === void 0) { staticQueue = false; }
            if (order === void 0) { order = null; }
            if (clearable === void 0) { clearable = []; }
            if (delay === void 0) { delay = 100; }
            if (repeat === void 0) { repeat = 10; }
            this._pieces = [];
            this._active = false;
            this._progress = 0;
            for (var i = app.stage.children.length - 1; i >= 0; --i) {
                app.stage.removeChild(app.stage.children[i]);
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
            for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
                var p = pieces_1[_i];
                p.validateOffset(this._width);
            }
            this._pieces = pieces;
            this._pieces.forEach(function (i) { return (i.initRotations()); });
            this._attack = new ASC.AttackTable(this._width);
            this.resetGame();
            app.stage.addChild(this._renderer);
        }
        Game.prototype.resetGame = function () {
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
        };
        Game.prototype.tick = function () {
            this.updateTime();
        };
        Game.prototype.gameOver = function () {
            this._active = false;
            this.updateTime();
        };
        Game.prototype.next = function () {
            this._currentPiece = this._queue.getNext();
            if (!this.checkShift(0, 0)) {
                this.gameOver();
                console.log("Game end");
            }
        };
        Game.prototype.hold = function () {
            this._currentPiece.reset();
            if (this._hold === undefined) {
                this._hold = this._currentPiece;
                this.next();
                return;
            }
            var temp = this._hold;
            this._hold = this._currentPiece;
            this._currentPiece = temp;
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
            var spin = this.checkImmobile();
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(this._currentPiece.color, true, true));
            var cleared = this.clearLines(this._currentPiece.getYVals());
            if (cleared > 0) {
                if (spin) {
                    this._progress += this._attack.spin(cleared);
                }
                else {
                    this._progress += this._attack.clear(cleared);
                }
                if (this.checkPC()) {
                    this._progress += this._attack.perfectClear(cleared);
                }
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
                var temp = [];
                for (var i = 0; i < 25; ++i) {
                    temp.push(0x000000);
                }
                this._renderer.updateHold(temp);
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
                temp[point] = (this._currentPiece.color & 0xfefefe) >> 1;
                ;
            }
            this._currentPiece = copyCurrent;
            for (var _b = 0, _c = this._currentPiece.getCoords(this._width); _b < _c.length; _b++) {
                var point = _c[_b];
                temp[point] = this._currentPiece.color;
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
        Game.prototype.updateTime = function () {
            this._renderer.updateTime("Timer off for now :)");
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
                this.update();
            }
            if (keyCode === 115) {
                this.resetGame();
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
            this._timeout = window.setTimeout(this.activate.bind(this), this._delay);
        };
        Key.prototype.activate = function () {
            this._interval = window.setInterval(this.repeat.bind(this), this._rate);
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
        InputManager.setFocus = function (f) {
            InputManager._focus = f;
        };
        InputManager.initialize = function () {
            for (var i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        };
        InputManager.onKeyDown = function (event) {
            if (InputManager._focus) {
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
            }
            return false;
        };
        InputManager.onKeyUp = function (event) {
            if (InputManager._focus) {
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
            }
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
        InputManager.cancelRepeat = function (keycode) {
            if (InputManager._keys.length > 0) {
                for (var _i = 0, _a = InputManager._keys; _i < _a.length; _i++) {
                    var k = _a[_i];
                    if (k.code === keycode) {
                        k.onRelease();
                    }
                }
            }
        };
        InputManager._keys = [];
        InputManager._keyCodes = [];
        InputManager._observers = [];
        InputManager._focus = true;
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
    ASC.NUM_PREVIEWS = 6;
    var IQueue = (function () {
        function IQueue() {
        }
        return IQueue;
    }());
    ASC.IQueue = IQueue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Piece = (function () {
        function Piece(name, shape, offset, color, initOrient) {
            if (offset === void 0) { offset = 0; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (initOrient === void 0) { initOrient = 0; }
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
        Piece.prototype.validateOffset = function (width) {
            for (var _i = 0, _a = this._orientations[this._initialOrientation]; _i < _a.length; _i++) {
                var i = _a[_i];
                if (~~(i / 5) !== ~~(((i % 5) + ~~(i / 5) * width + this._offset) / width)) {
                    throw new Error("Invalid offset! Piece will spawn out of bounds:");
                }
            }
            return true;
        };
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
            var copy = new Piece(this._name, this._shape, this._offset, this._color, this._initialOrientation);
            copy._orientations = this._orientations;
            copy._x = this._x;
            copy._y = this._y;
            copy._currentOrientation = this._currentOrientation;
            copy._color = this._color;
            return copy;
        };
        Piece.prototype.getRenderShape = function () {
            var temp = [];
            for (var i = 0; i < 25; ++i) {
                temp.push(0x000000);
            }
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                temp[i] = this._color;
            }
            return temp;
        };
        Piece.prototype.getShape = function () {
            return this._shape.slice(0);
        };
        Object.defineProperty(Piece.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Piece.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Piece.prototype, "offset", {
            get: function () {
                return this._offset;
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
    var Queue = (function (_super) {
        __extends(Queue, _super);
        function Queue(seed, pieces, size) {
            if (size === void 0) { size = pieces.length; }
            var _this = _super.call(this) || this;
            _this._queue = [];
            _this._rng = new ASC.PRNG(seed);
            _this._bag = pieces;
            _this._bagSize = size;
            _this.generateQueue();
            return _this;
        }
        Queue.prototype.generateQueue = function () {
            var _loop_1 = function () {
                var tempBag = [];
                while (tempBag.length < this_1._bagSize) {
                    this_1._bag.forEach(function (i) { return tempBag.push(i.getCopy()); });
                }
                this_1._rng.shuffleArray(tempBag);
                for (var _i = 0, _a = tempBag.slice(0, this_1._bagSize + 1); _i < _a.length; _i++) {
                    var i = _a[_i];
                    this_1._queue.push(i);
                }
            };
            var this_1 = this;
            while (this._queue.length < ASC.NUM_PREVIEWS) {
                _loop_1();
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
    }(ASC.IQueue));
    ASC.Queue = Queue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var StaticQueue = (function (_super) {
        __extends(StaticQueue, _super);
        function StaticQueue(pieces, order) {
            var _this = _super.call(this) || this;
            _this._queue = [];
            _this._bag = pieces;
            for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
                var i = order_1[_i];
                _this._queue.push(_this._bag[i].getCopy());
            }
            return _this;
        }
        StaticQueue.prototype.getQueue = function () {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
        };
        StaticQueue.prototype.getNext = function () {
            var temp = this._queue.splice(0, 1)[0];
            return temp;
        };
        return StaticQueue;
    }(ASC.IQueue));
    ASC.StaticQueue = StaticQueue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var FIELD_SIZE = 24;
    var SMALL_SIZE = 16;
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer(width, progress) {
            var _this = _super.call(this) || this;
            _this._queue = [];
            _this._field = new ASC.RenderGrid(width, ASC.FIELD_HEIGHT, FIELD_SIZE, SMALL_SIZE * 5);
            _this.addChild(_this._field);
            for (var i = 0; i < ASC.NUM_PREVIEWS; ++i) {
                _this._queue.push(new ASC.RenderGrid(5, 5, SMALL_SIZE, width * FIELD_SIZE + SMALL_SIZE * 5, SMALL_SIZE * 5 * i));
                _this.addChild(_this._queue[i]);
            }
            _this._hold = new ASC.RenderGrid(5, 5, SMALL_SIZE);
            _this.addChild(_this._hold);
            _this._progressText = progress;
            _this._progress = new PIXI.Text(progress + "\n", { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
            _this._progress.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            _this._progress.y = SMALL_SIZE * 5 * ASC.NUM_PREVIEWS + 10;
            _this.addChild(_this._progress);
            _this._time = new PIXI.Text("\n\nhi", { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
            _this._time.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            _this._time.y = SMALL_SIZE * 5 * ASC.NUM_PREVIEWS + 10;
            _this.addChild(_this._time);
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
        Renderer.prototype.updateTime = function (t) {
            this._time.text = "\n\nTime:" + t;
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
    var PC = 6;
    var AttackTable = (function () {
        function AttackTable(width) {
            this._width = width;
        }
        AttackTable.prototype.clear = function (num) {
            return this.widthMultiplier(num + CLEAR);
        };
        AttackTable.prototype.spin = function (num) {
            return this.widthMultiplier(num * SPIN);
        };
        AttackTable.prototype.perfectClear = function (num) {
            return this.widthMultiplier(PC);
        };
        AttackTable.prototype.widthMultiplier = function (num) {
            return num + ~~(num * (this._width - 10) / 4);
        };
        return AttackTable;
    }());
    ASC.AttackTable = AttackTable;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Timer = (function () {
        function Timer(tick, finish, interval, end) {
            this._elapsed = 0;
            this._finish = finish;
            this._interval = interval;
            this._tick = tick;
            this._end = end;
        }
        Timer.prototype.start = function () {
            this.stop();
            this._elapsed = 0;
            this._expectedEnd = Date.now() + this._end;
            this._expected = Date.now() + this._interval;
            this._timeout = window.setTimeout(this.step.bind(this), this._interval);
        };
        Timer.prototype.stop = function () {
            clearTimeout(this._timeout);
        };
        Timer.prototype.step = function () {
            this._elapsed += this._interval;
            if (Date.now() >= this._expectedEnd) {
                this.stop();
                this._finish();
                return;
            }
            var drift = Date.now() - this._expected;
            this._tick();
            this._expected += this._interval;
            this._timeout = window.setTimeout(this.step.bind(this), Math.max(0, this._interval - drift));
        };
        Object.defineProperty(Timer.prototype, "elapsed", {
            get: function () {
                return this._elapsed;
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    }());
    ASC.Timer = Timer;
})(ASC || (ASC = {}));
var M;
(function (M) {
    var MapEditor = (function () {
        function MapEditor() {
            this._mapDiv = document.createElement("div");
            this._mapTable = document.createElement("table");
            this._blocks = [];
            this._width = 12;
            var mapR;
            var _loop_2 = function (i) {
                if (i % this_2._width === 0) {
                    mapR = document.createElement("tr");
                    this_2._mapTable.appendChild(mapR);
                }
                var b = document.createElement("input");
                b.setAttribute("type", "checkbox");
                b.onmouseenter = function () {
                    if (D.Drag.mouseDown) {
                        b.checked = D.Drag.lastState;
                    }
                };
                b.onmousedown = function (ev) {
                    D.Drag.lastState = !b.checked;
                    D.Drag.lastSelected = b;
                    b.checked = D.Drag.lastState;
                    ev.preventDefault();
                };
                b.onmouseup = function (ev) {
                    if (D.Drag.lastSelected == b) {
                        b.checked = !b.checked;
                    }
                    ev.preventDefault();
                };
                b.ondragover = function (ev) {
                    ev.preventDefault();
                    ev.preventDefault();
                };
                this_2._blocks.push(b);
                mapR.appendChild(b);
            };
            var this_2 = this;
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                _loop_2(i);
            }
            this._mapDiv.appendChild(this._mapTable);
        }
        MapEditor.prototype.getDiv = function () {
            return this._mapDiv;
        };
        MapEditor.prototype.setWidth = function (width) {
            this._width = width;
        };
        return MapEditor;
    }());
    M.MapEditor = MapEditor;
    function init() {
    }
    init();
})(M || (M = {}));
var P;
(function (P) {
    var PieceEditor = (function () {
        function PieceEditor(width, pieces) {
            if (width === void 0) { width = 12; }
            if (pieces === void 0) { pieces = []; }
            this._pieceDiv = document.createElement("div");
            this._pieces = [];
            this._width = 12;
            this._pieceSelect = document.createElement("select");
            this._checks = [];
            this._pieceNameInput = document.createElement("input");
            this._pieceColor = document.createElement("input");
            this._offsetSlider = document.createElement("input");
            this._offsetText = document.createElement("label");
            this._width = width;
            this._pieces = pieces;
            this._pieceSelect.onchange = this.displayPiece.bind(this);
            this._pieceDiv.appendChild(this._pieceSelect);
            var addPiece = document.createElement("button");
            addPiece.innerText = "Apply Piece Settings";
            addPiece.onclick = this.addPieceClick.bind(this);
            this._pieceDiv.appendChild(addPiece);
            var removePiece = document.createElement("button");
            removePiece.innerText = "Remove Piece";
            removePiece.onclick = this.removePieceClick.bind(this);
            this._pieceDiv.appendChild(removePiece);
            var editorTable = document.createElement("table");
            var row1;
            var _loop_3 = function (i) {
                if (i % 5 === 0) {
                    row1 = document.createElement("tr");
                    editorTable.appendChild(row1);
                }
                var check = document.createElement("input");
                check.setAttribute("type", "checkbox");
                check.onmouseenter = function () {
                    if (D.Drag.mouseDown) {
                        check.checked = D.Drag.lastState;
                    }
                };
                check.onmousedown = function (ev) {
                    D.Drag.lastState = !check.checked;
                    D.Drag.lastSelected = check;
                    check.checked = D.Drag.lastState;
                    ev.preventDefault();
                };
                check.onmouseup = function (ev) {
                    if (D.Drag.lastSelected == check) {
                        check.checked = !check.checked;
                    }
                    ev.preventDefault();
                };
                check.ondragover = function (ev) {
                    ev.preventDefault();
                };
                this_3._checks.push(check);
                row1.appendChild(check);
            };
            var this_3 = this;
            for (var i = 0; i < 25; ++i) {
                _loop_3(i);
            }
            this._pieceDiv.appendChild(editorTable);
            var pieceNameText = document.createElement("label");
            pieceNameText.innerText = "Piece Name: ";
            this._pieceDiv.appendChild(pieceNameText);
            this._pieceNameInput.setAttribute("type", "text");
            this._pieceDiv.appendChild(this._pieceNameInput);
            this._pieceDiv.appendChild(document.createElement("br"));
            var pieceColorText = document.createElement("label");
            pieceColorText.innerText = "Piece Color (Chrome and Firefox will have color picker, other browsers enter in form #FFF000): ";
            this._pieceDiv.appendChild(pieceColorText);
            this._pieceColor.setAttribute("type", "color");
            this._pieceColor.setAttribute("value", "#FFFFFF");
            this._pieceDiv.appendChild(this._pieceColor);
            this._pieceDiv.appendChild(document.createElement("br"));
            this._offsetText.innerText = "Offset (where piece spawns): 0";
            this._pieceDiv.appendChild(this._offsetText);
            this._offsetSlider.setAttribute("type", "range");
            this._offsetSlider.setAttribute("min", "0");
            this._offsetSlider.setAttribute("max", this._width.toString());
            this._offsetSlider.setAttribute("value", "0");
            this._offsetSlider.oninput = this.offsetUpdate.bind(this);
            this._pieceDiv.appendChild(document.createElement("br"));
            this._pieceDiv.appendChild(this._offsetSlider);
            this.updateList();
            this.displayPiece();
        }
        PieceEditor.prototype.removePieceClick = function () {
            if (this._pieces.length > 1) {
                this._pieces.splice(Number(this._pieceSelect.value), 1);
            }
            else {
                alert("Need at least one piece");
            }
            this.updateList();
            this.displayPiece();
        };
        PieceEditor.prototype.addPieceClick = function () {
            var indices = [];
            for (var i = 0; i < this._checks.length; ++i) {
                if (this._checks[i].checked) {
                    indices.push(i);
                }
            }
            if (indices.length > 0) {
                try {
                    var val = this._pieceSelect.selectedIndex;
                    if (val == this._pieceSelect.childElementCount - 1) {
                        this._pieces.push(new ASC.Piece(this._pieceNameInput.value, indices, this._offsetSlider.valueAsNumber, Number("0x" + this._pieceColor.value.substring(1))));
                    }
                    else {
                        this._pieces[val] = new ASC.Piece(this._pieceNameInput.value, indices, this._offsetSlider.valueAsNumber, Number("0x" + this._pieceColor.value.substring(1)));
                    }
                    this.updateList();
                    this.displayPiece();
                }
                catch (err) {
                    alert("Invalid Piece: " + err);
                }
            }
            else {
                alert("Need at least 1 block");
            }
        };
        PieceEditor.prototype.offsetUpdate = function () {
            this._offsetText.innerText = "Offset (where piece spawns): " + this._offsetSlider.value;
        };
        PieceEditor.prototype.updateList = function () {
            while (this._pieceSelect.firstChild) {
                this._pieceSelect.removeChild(this._pieceSelect.lastChild);
            }
            for (var i = 0; i < this._pieces.length; ++i) {
                var p = document.createElement("option");
                p.value = i.toString();
                p.innerText = this._pieces[i].name;
                this._pieceSelect.appendChild(p);
            }
            var n = document.createElement("option");
            n.value = this._pieceSelect.childElementCount.toString();
            n.innerText = "New Piece";
            this._pieceSelect.appendChild(n);
        };
        PieceEditor.prototype.displayPiece = function () {
            var val = this._pieceSelect.selectedIndex;
            if (val !== this._pieceSelect.childElementCount - 1) {
                for (var _i = 0, _a = this._checks; _i < _a.length; _i++) {
                    var i = _a[_i];
                    i.checked = false;
                }
                for (var _b = 0, _c = this._pieces[val].getShape(); _b < _c.length; _b++) {
                    var i = _c[_b];
                    this._checks[i].checked = true;
                }
                this._pieceNameInput.value = this._pieces[val].name;
                this._pieceColor.value = this.cth(this._pieces[val].color);
                this._offsetSlider.value = this._pieces[val].offset.toString();
            }
        };
        PieceEditor.prototype.cth = function (i) {
            var hex = '000000';
            hex += i.toString(16);
            hex = hex.substring(hex.length - 6, hex.length);
            return "#" + hex;
        };
        PieceEditor.prototype.getDiv = function () {
            return this._pieceDiv;
        };
        PieceEditor.prototype.setWidth = function (width) {
            this._width = width;
        };
        PieceEditor.prototype.getPieces = function () {
            return this._pieces;
        };
        return PieceEditor;
    }());
    P.PieceEditor = PieceEditor;
})(P || (P = {}));
var SETTINGS;
(function (SETTINGS) {
    function init() {
        var pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
            new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];
        var config = new ASC.Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32], 100, 10, 7);
        var pieceEditor = new P.PieceEditor(config._width, pieces);
        D.Drag.init();
        var settings = document.createElement("div");
        settings.style.border = "1px solid black";
        var title = document.createElement("H1");
        title.innerText = "Settings";
        settings.appendChild(title);
        var widthText = document.createElement("label");
        widthText.innerText = "Width: " + config._width.toString();
        settings.appendChild(widthText);
        settings.appendChild(document.createElement("br"));
        var widthSlider = document.createElement("input");
        widthSlider.setAttribute("type", "range");
        widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
        widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
        widthSlider.setAttribute("value", "10");
        widthSlider.oninput = function () {
            if (!isNaN(Number(widthSlider.value))) {
                config._width = Number(widthSlider.value);
                pieceEditor.setWidth(config._width);
                widthText.innerText = "Width: " + config._width.toString();
            }
        };
        settings.appendChild(widthSlider);
        var controlsTitle = document.createElement("H2");
        controlsTitle.innerText = "Controls:";
        settings.appendChild(controlsTitle);
        var controlTable = document.createElement("table");
        var labels = ["Right", "Soft Drop", "Left", "CW", "CCW", "180", "Hold", "Hard Drop"];
        var row;
        var _loop_4 = function (i) {
            if (i % 4 === 0) {
                row = document.createElement("tr");
                controlTable.appendChild(row);
            }
            var item = document.createElement("th");
            item.innerText = labels[i] + ": ";
            var numberbox = document.createElement("input");
            numberbox.setAttribute("type", "number");
            numberbox.readOnly = true;
            numberbox.setAttribute("value", config._controls[i].toString());
            numberbox.onkeydown = function (event) {
                if (event.keyCode !== 27) {
                    numberbox.value = event.keyCode.toString();
                    config._controls[i] = event.keyCode;
                }
                numberbox.blur();
            };
            item.appendChild(numberbox);
            row.appendChild(item);
        };
        for (var i = 0; i < labels.length; ++i) {
            _loop_4(i);
        }
        settings.appendChild(controlTable);
        var delayText = document.createElement("label");
        delayText.innerText = "Delay: ";
        settings.appendChild(delayText);
        var delay = document.createElement("input");
        delay.setAttribute("type", "number");
        delay.setAttribute("min", "1");
        delay.setAttribute("value", config._delay.toString());
        delay.oninput = function () {
            if (!isNaN(Number(delay.value))) {
                config._delay = Number(delay.value);
            }
        };
        settings.appendChild(delay);
        var repeatText = document.createElement("label");
        repeatText.innerText = "Repeat: ";
        settings.appendChild(repeatText);
        var repeat = document.createElement("input");
        repeat.setAttribute("type", "number");
        repeat.setAttribute("min", "1");
        repeat.setAttribute("value", config._repeat.toString());
        repeat.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                config._repeat = Number(repeat.value);
            }
        };
        settings.appendChild(repeat);
        var bagText = document.createElement("label");
        bagText.innerText = "Bag: ";
        settings.appendChild(bagText);
        var bag = document.createElement("input");
        bag.setAttribute("type", "number");
        bag.setAttribute("min", "0");
        bag.setAttribute("value", config._bagSize.toString());
        bag.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                config._bagSize = Number(bag.value);
            }
        };
        settings.appendChild(bag);
        settings.appendChild(document.createElement("hr"));
        settings.appendChild(pieceEditor.getDiv());
        var apply = document.createElement("button");
        apply.innerText = "Apply Settings";
        apply.onclick = function () {
            config._pieces = pieceEditor.getPieces();
            startGame(config);
        };
        settings.appendChild(apply);
        document.body.appendChild(settings);
    }
    init();
})(SETTINGS || (SETTINGS = {}));
//# sourceMappingURL=main.js.map