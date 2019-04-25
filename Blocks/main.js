var RUN;
(function (RUN) {
    function init() {
        RUN.app = new PIXI.Application(800, 600, { backgroundColor: 0x333333 });
        RUN.app.view.setAttribute('tabindex', '0');
        document.body.onclick = function () {
            ASC.InputManager.setFocus(document.activeElement == RUN.app.view);
        };
        PIXI.loader.add('assets/textures/b.png').load(load);
        RUN.app.view.onclick = () => (RUN.app.view.focus());
        document.body.appendChild(RUN.app.view);
    }
    RUN.init = init;
    function startGame(config, static = false, queue = [], map = []) {
        try {
            if (config !== undefined) {
                RUN.game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, static, queue, map, config._delay, config._repeat);
            }
            else {
                RUN.game = new ASC.Game();
            }
        }
        catch (err) {
            alert("Error in config: " + err);
            RUN.game = new ASC.Game();
        }
        RUN.app.view.focus();
    }
    RUN.startGame = startGame;
    function load() {
        if (RUN.afterLoad == undefined) {
            startGame();
        }
        else {
            RUN.afterLoad();
        }
        RUN.app.view.focus();
        ASC.InputManager.initialize();
        let newGameButton = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (RUN.game.resetGame());
        document.body.appendChild(newGameButton);
        let lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold", "Instant Drop", "Restart"];
        for (let i = 0; i < lables.length; ++i) {
            let be = document.createElement("button");
            be.innerText = lables[i];
            be.onclick = function (ev) { RUN.game.touchControl(i); ev.preventDefault(); };
            be.style.fontSize = "2em";
            document.body.appendChild(be);
        }
    }
})(RUN || (RUN = {}));
var ASC;
(function (ASC) {
    class Config {
        constructor(w, p, c, d, r, b) {
            this._controls = [];
            this._width = w;
            this._bagSize = b;
            this._pieces = p;
            this._controls = c;
            this._delay = d;
            this._repeat = r;
        }
        static fromText(input) {
            let cfg = JSON.parse(input);
            let ps = [];
            for (let i of cfg.pieces) {
                ps.push(new ASC.Piece(i[0], i[1], i[2], Number("0x" + i[3]), 0));
            }
            let config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        }
        static pieceFromText(input) {
            let p = JSON.parse(input);
            let ps = [];
            for (let i of p) {
                ps.push(new ASC.Piece(i._name, i._shape, i._offset, i._color));
            }
            return ps;
        }
    }
    ASC.Config = Config;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    let Rotations;
    (function (Rotations) {
        Rotations[Rotations["NONE"] = 0] = "NONE";
        Rotations[Rotations["CW"] = 1] = "CW";
        Rotations[Rotations["CWCW"] = 2] = "CWCW";
        Rotations[Rotations["CCW"] = 3] = "CCW";
    })(Rotations = ASC.Rotations || (ASC.Rotations = {}));
    let Directions;
    (function (Directions) {
        Directions[Directions["UP"] = 0] = "UP";
        Directions[Directions["RIGHT"] = 1] = "RIGHT";
        Directions[Directions["DOWN"] = 2] = "DOWN";
        Directions[Directions["LEFT"] = 3] = "LEFT";
    })(Directions = ASC.Directions || (ASC.Directions = {}));
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Field {
        constructor(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        initialize() {
            for (let i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                this._array.push(new ASC.Block());
            }
        }
        shift(lines) {
            this._array.splice(0, lines * this._width);
            for (let i = 0; i < lines * this._width; ++i) {
                this._array.push(new ASC.Block());
            }
        }
        getAt(index) {
            return this._array[index];
        }
        getColors() {
            let c = [];
            for (let i of this._array) {
                c.push(i.color);
            }
            return c;
        }
        setBlocks(indices, block) {
            for (let i of indices) {
                this._array[i] = block;
            }
        }
        clearLineAt(yval) {
            this._array.splice(yval * this._width, this._width);
            for (let i = 0; i < this._width; ++i) {
                this._array.unshift(new ASC.Block());
            }
        }
    }
    ASC.Field = Field;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
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
        Inputs[Inputs["SONIC"] = 8] = "SONIC";
        Inputs[Inputs["RESTART"] = 9] = "RESTART";
    })(Inputs || (Inputs = {}));
    class Game {
        constructor(width = 12, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], controls = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], staticQueue = false, order = null, clearable = [], delay = 100, repeat = 10) {
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
            for (let p of pieces) {
                p.validateOffset(this._width);
            }
            this._pieces = pieces;
            this._pieces.forEach((i) => (i.initRotations()));
            this._attack = new ASC.AttackTable(this._width);
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
            this._renderer.updateTime("new game haha :)");
            this.update();
        }
        tick() {
            this.updateTime();
        }
        gameOver() {
            this._active = false;
            this.updateTime();
        }
        next() {
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
        hold() {
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
                if (block == null ||
                    yvals[i] != ~~((coords[i] + x) / this._width) ||
                    block.solid) {
                    return false;
                }
            }
            return true;
        }
        rotate(dir) {
            this._currentPiece.rotate(dir);
            if (this.checkShift(0, 0)) {
                return;
            }
            if (dir !== ASC.Rotations.CWCW) {
                let sign = -(dir - 2);
                console.log("Trying to kick:");
                for (let x = 0; x < 8; ++x) {
                    let xkicks = Math.pow(-1, x) * ~~(x / 2) * sign;
                    for (let i = 0; i < (x + 1) * 2; ++i) {
                        let ykicks = (Math.pow(-1, i) * ~~(i / 2) + ~~(i / 4));
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
            let temp = this._field.getColors();
            if (this._currentPiece != undefined) {
                let copyCurrent = this._currentPiece.getCopy();
                this.sonicDrop();
                for (let point of this._currentPiece.getCoords(this._width)) {
                    temp[point] = (this._currentPiece.color & 0xfefefe) >> 1;
                    ;
                }
                this._currentPiece = copyCurrent;
                for (let point of this._currentPiece.getCoords(this._width)) {
                    temp[point] = this._currentPiece.color;
                }
            }
            this._renderer.updateField(temp);
        }
        updateQueue() {
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
        }
        clearLines(yvals) {
            let lines = 0;
            yvals.sort(function (a, b) { return a - b; });
            for (let y of yvals) {
                for (let i = 0; i < this._width; i++) {
                    let block = this._field.getAt(y * this._width + i);
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
                this.update();
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
                    case this._controls[Inputs.SONIC]:
                        this.sonicDrop();
                        break;
                }
                this.update();
            }
            if (keyCode == this._controls[Inputs.RESTART]) {
                this.resetGame();
            }
        }
    }
    ASC.Game = Game;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    let Keys;
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
    class Key {
        constructor(code, delay = 100, rate = 20) {
            this._pressed = false;
            this._listeners = [];
            this._code = code;
            this._delay = delay;
            this._rate = rate;
        }
        onPress() {
            this._pressed = true;
            this._timeout = window.setTimeout(this.activate.bind(this), this._delay);
        }
        activate() {
            this._interval = window.setInterval(this.repeat.bind(this), this._rate);
        }
        repeat() {
            for (let l of this._listeners) {
                l.Triggered(this._code);
            }
        }
        onRelease() {
            this._pressed = false;
            clearTimeout(this._timeout);
            clearInterval(this._interval);
        }
        registerTrigger(t) {
            this._listeners.push(t);
        }
        get code() {
            return this._code;
        }
    }
    class InputManager {
        constructor() { }
        static setFocus(f) {
            InputManager._focus = f;
        }
        static initialize() {
            for (let i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        }
        static onKeyDown(event) {
            if (InputManager._focus) {
                if (InputManager._keyCodes[event.keyCode] !== true) {
                    InputManager.NotifyObservers(event.keyCode);
                    InputManager._keyCodes[event.keyCode] = true;
                    if (InputManager._keys.length > 0) {
                        for (let k of InputManager._keys) {
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
        }
        static onKeyUp(event) {
            if (InputManager._focus) {
                InputManager._keyCodes[event.keyCode] = false;
                if (InputManager._keys.length > 0) {
                    for (let k of InputManager._keys) {
                        if (k.code === event.keyCode) {
                            k.onRelease();
                        }
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
            return false;
        }
        static RegisterKeys(Observer, keyCodes, delay, repeat) {
            for (let i of keyCodes) {
                InputManager._keys.push(new Key(i, delay, repeat));
                InputManager._keys[InputManager._keys.length - 1].registerTrigger(Observer);
            }
        }
        static RegisterObserver(Observer) {
            InputManager._observers.push(Observer);
        }
        static UnregisterObserver(Observer) {
            let index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1);
            }
            else {
                console.warn("Cannot unregister observer.");
            }
        }
        static NotifyObservers(keyevent) {
            for (let o of InputManager._observers) {
                o.Triggered(keyevent);
            }
        }
        static cancelRepeat(keycode) {
            if (InputManager._keys.length > 0) {
                for (let k of InputManager._keys) {
                    if (k.code === keycode) {
                        k.onRelease();
                    }
                }
            }
        }
    }
    InputManager._keys = [];
    InputManager._keyCodes = [];
    InputManager._observers = [];
    InputManager._focus = true;
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Block {
        constructor(color = 0x000000, solid = false, clearable = false) {
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        get color() {
            return this._color;
        }
        get solid() {
            return this._solid;
        }
        get clearable() {
            return this._clearable;
        }
    }
    ASC.Block = Block;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    ASC.NUM_PREVIEWS = 6;
    class IQueue {
    }
    ASC.IQueue = IQueue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Piece {
        constructor(name, shape, offset = 0, color = 0xFFFFFF, initOrient = 0) {
            this._shape = [];
            this._orientations = [];
            this._currentOrientation = 0;
            this._x = 0;
            this._y = 0;
            this._name = name.substr(0, 1);
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this.reset();
        }
        validateOffset(width) {
            for (let i of this._orientations[this._initialOrientation]) {
                if (~~(i / 5) !== ~~(((i % 5) + ~~(i / 5) * width + this._offset) / width)) {
                    throw new Error("Invalid offset! Piece will spawn out of bounds:" + this._name + " offset: " + this._offset);
                }
            }
            return true;
        }
        initRotations() {
            this._orientations.push(this._shape);
            let temp = [];
            for (let i of this._shape) {
                temp.push(20 - 5 * (i % 5) + ~~(i / 5));
            }
            this._orientations.push(temp);
            temp = [];
            for (let i of this._shape) {
                temp.push(24 - i);
            }
            this._orientations.push(temp);
            temp = [];
            for (let i of this._shape) {
                temp.push(4 + 5 * (i % 5) - ~~(i / 5));
            }
            this._orientations.push(temp);
        }
        setShape(shape) {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            this._blockCount = shape.length;
            for (let i of shape) {
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._blockCount = shape.length;
            this._shape = shape;
            this._orientations.push(shape);
            let cw = [];
            let ccw = [];
            let cwcw = [];
            for (let i of shape) {
                cw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                ccw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        }
        rotate(dir) {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
        }
        move(x, y) {
            this._x += x;
            this._y += y;
        }
        getCoords(width) {
            let c = [];
            for (let i of this._orientations[this._currentOrientation]) {
                let newI = (i % 5) + ~~(i / 5) * width;
                c.push(newI + this._x + this._y * width);
            }
            return c;
        }
        getYVals() {
            let c = [];
            for (let i of this._orientations[this._currentOrientation]) {
                let y = ~~(i / 5) + this._y;
                c.push(y);
            }
            return c;
        }
        reset() {
            this._currentOrientation = this._initialOrientation;
            this._x = this._offset;
            this._y = 0;
        }
        getCopy() {
            let copy = new Piece(this._name, this._shape, this._offset, this._color, this._initialOrientation);
            copy._orientations = this._orientations;
            copy._x = this._x;
            copy._y = this._y;
            copy._currentOrientation = this._currentOrientation;
            copy._color = this._color;
            return copy;
        }
        getRenderShape() {
            let temp = [];
            for (let i = 0; i < 25; ++i) {
                temp.push(-1);
            }
            for (let i of this._shape) {
                temp[i] = this._color;
            }
            return temp;
        }
        get name() {
            return this._name;
        }
        get color() {
            return this._color;
        }
        get offset() {
            return this._offset;
        }
    }
    ASC.Piece = Piece;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class PRNG {
        constructor(seed) {
            this._seed = Math.round(seed) % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }
        next() {
            return this._seed = this._seed * 16807 % 2147483647;
        }
        nextFloat() {
            return (this.next() - 1) / 2147483646;
        }
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(this.nextFloat() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
    ASC.PRNG = PRNG;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Queue extends ASC.IQueue {
        constructor(seed, pieces, size = pieces.length) {
            super();
            this._queue = [];
            this._rng = new ASC.PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        generateQueue() {
            while (this._queue.length < ASC.NUM_PREVIEWS) {
                let tempBag = [];
                while (tempBag.length < this._bagSize) {
                    this._bag.forEach((i) => tempBag.push(i.getCopy()));
                }
                this._rng.shuffleArray(tempBag);
                for (let i of tempBag.slice(0, this._bagSize + 1)) {
                    this._queue.push(i);
                }
            }
        }
        getQueue() {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
        }
        getNext() {
            let temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        }
        hasNext() {
            return true;
        }
    }
    ASC.Queue = Queue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class StaticQueue extends ASC.IQueue {
        constructor(pieces, order) {
            super();
            this._queue = [];
            this._bag = pieces;
            for (let i of order) {
                this._queue.push(this._bag[i].getCopy());
            }
        }
        getQueue() {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
        }
        getNext() {
            let temp = this._queue.splice(0, 1)[0];
            return temp;
        }
        hasNext() {
            return this._queue.length > 0;
        }
    }
    ASC.StaticQueue = StaticQueue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    const FIELD_SIZE = 24;
    const SMALL_SIZE = 16;
    class Renderer extends PIXI.Container {
        constructor(width, progress) {
            super();
            this._queue = [];
            this._field = new ASC.RenderGrid(width, ASC.FIELD_HEIGHT, FIELD_SIZE, SMALL_SIZE * 5);
            this.addChild(this._field);
            for (let i = 0; i < ASC.NUM_PREVIEWS; ++i) {
                this._queue.push(new ASC.RenderGrid(5, 5, SMALL_SIZE, width * FIELD_SIZE + SMALL_SIZE * 5, SMALL_SIZE * 5 * i));
                this.addChild(this._queue[i]);
            }
            this._hold = new ASC.RenderGrid(5, 5, SMALL_SIZE);
            this.addChild(this._hold);
            this._progressText = progress;
            this._progress = new PIXI.Text(progress + "\n", { fontFamily: 'Arial Black', fontSize: 24, fill: 0xFFFFFF, align: 'center' });
            this._progress.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            this._progress.y = SMALL_SIZE * 5 * ASC.NUM_PREVIEWS + 10;
            this.addChild(this._progress);
            this._time = new PIXI.Text("\n\nhi", { fontFamily: 'Arial Black', fontSize: 24, fill: 0xFFFFFF, align: 'center' });
            this._time.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            this._time.y = SMALL_SIZE * 5 * ASC.NUM_PREVIEWS + 10;
            this.addChild(this._time);
        }
        updateField(Field) {
            this._field.updateGrid(Field);
        }
        updateQueue(q) {
            for (let i = 0; i < q.length; ++i) {
                this._queue[i].updateGrid(q[i]);
            }
        }
        updateHold(p) {
            this._hold.updateGrid(p);
        }
        updateProgress(t) {
            this._progress.text = this._progressText + "\n" + t;
        }
        updateTime(t) {
            this._time.text = "\n\nTime: " + t;
        }
    }
    ASC.Renderer = Renderer;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class RenderGrid extends PIXI.Container {
        constructor(width, height, size = 24, x = 0, y = 0) {
            super();
            this._width = width;
            this._height = height;
            this._size = size;
            this._x = x;
            this._y = y;
            this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
            this.initalizeSprites();
        }
        initalizeSprites() {
            this._sprites = [];
            for (let i = 0; i < this._width * this._height; ++i) {
                let s = new PIXI.Sprite(this._texture);
                s.height = this._size;
                s.width = this._size;
                s.x = i % this._width * this._size + this._x;
                s.y = ~~(i / this._width) * this._size + this._y;
                s.tint = 0x000000;
                this.addChild(s);
                this._sprites.push(s);
            }
        }
        updateColor(index, color) {
            if (color < 0) {
                this._sprites[index].tint = 0x000000;
            }
            else {
                this._sprites[index].tint = color;
            }
        }
        updateGrid(Field) {
            for (let i = 0; i < Field.length; ++i) {
                this.updateColor(i, Field[i]);
            }
        }
    }
    ASC.RenderGrid = RenderGrid;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    const CLEAR = -1;
    const SPIN = 2;
    const PC = 6;
    class AttackTable {
        constructor(width) {
            this._width = width;
        }
        clear(num) {
            return this.widthMultiplier(num + CLEAR);
        }
        spin(num) {
            return this.widthMultiplier(num * SPIN);
        }
        perfectClear(num) {
            return this.widthMultiplier(PC);
        }
        widthMultiplier(num) {
            return num + ~~(num * (this._width - 10) / 4);
        }
    }
    ASC.AttackTable = AttackTable;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Timer {
        constructor(tick, finish, interval, end) {
            this._elapsed = 0;
            this._finish = finish;
            this._interval = interval;
            this._tick = tick;
            this._end = end;
        }
        start() {
            this.stop();
            this._elapsed = 0;
            this._expectedEnd = Date.now() + this._end;
            this._expected = Date.now() + this._interval;
            this._timeout = window.setTimeout(this.step.bind(this), this._interval);
        }
        stop() {
            clearTimeout(this._timeout);
        }
        step() {
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
        }
        get elapsed() {
            return this._elapsed;
        }
    }
    ASC.Timer = Timer;
})(ASC || (ASC = {}));
var D;
(function (D) {
    class Drag {
        static init() {
            document.body.onmousedown = function () {
                Drag.mouseDown = true;
            };
            document.body.onmouseup = function () {
                Drag.mouseDown = false;
            };
            document.body.onmouseleave = function () {
                Drag.mouseDown = false;
            };
        }
    }
    Drag.mouseDown = false;
    Drag.lastState = false;
    D.Drag = Drag;
})(D || (D = {}));
var P;
(function (P) {
    class PieceEditor {
        constructor(width = 12, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
            new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)]) {
            this._pieceDiv = document.createElement("div");
            this._pieces = [];
            this._width = 12;
            this._pieceSelect = document.createElement("select");
            this._checks = [];
            this._pieceNameInput = document.createElement("input");
            this._pieceColor = document.createElement("input");
            this._offsetSlider = document.createElement("input");
            this._offsetText = document.createElement("label");
            this._addPiece = document.createElement("button");
            this._removePiece = document.createElement("button");
            this._width = width;
            this._pieces = pieces;
            this._pieceSelect.onchange = this.displayPiece.bind(this);
            this._pieceDiv.appendChild(this._pieceSelect);
            this._addPiece.innerText = "Apply Piece Settings";
            this._addPiece.onclick = this.addPieceClick.bind(this);
            this._pieceDiv.appendChild(this._addPiece);
            this._removePiece.innerText = "Remove Piece";
            this._removePiece.onclick = this.removePieceClick.bind(this);
            this._pieceDiv.appendChild(this._removePiece);
            let editorTable = document.createElement("table");
            let row1;
            for (let i = 0; i < 25; ++i) {
                if (i % 5 === 0) {
                    row1 = document.createElement("tr");
                    editorTable.appendChild(row1);
                }
                let check = new C.Checkbox();
                this._checks.push(check);
                row1.appendChild(check.getTD());
            }
            this._pieceDiv.appendChild(editorTable);
            let pieceNameText = document.createElement("label");
            pieceNameText.innerText = "Piece Name: ";
            this._pieceDiv.appendChild(pieceNameText);
            this._pieceNameInput.setAttribute("type", "text");
            this._pieceDiv.appendChild(this._pieceNameInput);
            this._pieceDiv.appendChild(document.createElement("br"));
            let pieceColorText = document.createElement("label");
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
        removePieceClick() {
            if (this._pieces.length > 1) {
                this._pieces.splice(Number(this._pieceSelect.value), 1);
            }
            else {
                alert("Need at least one piece");
            }
            this.updateList();
            this.displayPiece();
        }
        addPieceClick() {
            let indices = [];
            for (let i = 0; i < this._checks.length; ++i) {
                if (this._checks[i].checked) {
                    indices.push(i);
                }
            }
            if (indices.length > 0) {
                try {
                    let val = this._pieceSelect.selectedIndex;
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
        }
        offsetUpdate() {
            this._offsetText.innerText = "Offset (where piece spawns): " + this._offsetSlider.value;
        }
        updateList() {
            while (this._pieceSelect.firstChild) {
                this._pieceSelect.removeChild(this._pieceSelect.lastChild);
            }
            for (let i = 0; i < this._pieces.length; ++i) {
                let p = document.createElement("option");
                p.value = i.toString();
                p.innerText = i.toString() + ". \"" + this._pieces[i].name + "\"";
                this._pieceSelect.appendChild(p);
            }
            let n = document.createElement("option");
            n.value = this._pieceSelect.childElementCount.toString();
            n.innerText = "New Piece";
            this._pieceSelect.appendChild(n);
        }
        displayPiece() {
            let val = this._pieceSelect.selectedIndex;
            if (val !== this._pieceSelect.childElementCount - 1) {
                let shape = this._pieces[val].getRenderShape();
                for (let i = 0; i < 25; i++) {
                    this._checks[i].checked = (shape[i] !== -1);
                }
                this._pieceNameInput.value = this._pieces[val].name;
                this._pieceColor.value = this.cth(this._pieces[val].color);
                this._offsetSlider.value = this._pieces[val].offset.toString();
                this.offsetUpdate();
            }
        }
        cth(i) {
            let hex = '000000';
            hex += i.toString(16);
            hex = hex.substring(hex.length - 6, hex.length);
            return "#" + hex;
        }
        getDiv() {
            return this._pieceDiv;
        }
        setWidth(width) {
            for (let i of this._pieces) {
                i.validateOffset(width);
            }
            this._width = width;
        }
        getPieces() {
            return this._pieces;
        }
        disable(state) {
            this._pieceSelect.disabled = state;
            this._pieceNameInput.disabled = state;
            this._offsetSlider.disabled = state;
            this._pieceColor.disabled = state;
            for (let c of this._checks) {
                c.disabled = state;
            }
            this._addPiece.disabled = state;
            this._removePiece.disabled = state;
        }
        setPieces(p) {
            this._pieces = p;
            for (let i of this._pieces) {
                i.validateOffset(this._width);
            }
            this.updateList();
            this.displayPiece();
        }
    }
    P.PieceEditor = PieceEditor;
})(P || (P = {}));
var M;
(function (M) {
    class MapEditor {
        constructor() {
            this._mapDiv = document.createElement("div");
            this._mapTable = document.createElement("table");
            this._blocks = [];
            this._width = 12;
            this._lefts = document.createElement("td");
            this._widthText = document.createElement("label");
            this._widthSlider = document.createElement("input");
            this._queueInput = document.createElement("input");
            let table = document.createElement("table");
            let row = document.createElement("tr");
            let rights = document.createElement("td");
            table.style.border = "1px solid black";
            let title = document.createElement("H1");
            title.innerText = "Settings";
            rights.appendChild(title);
            this._widthText.innerText = "Width: " + this._width.toString();
            rights.appendChild(this._widthText);
            rights.appendChild(document.createElement("br"));
            this._widthSlider.setAttribute("type", "range");
            this._widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("value", this._width.toString());
            this._widthSlider.oninput = this.widthInput.bind(this);
            rights.appendChild(this._widthSlider);
            this._pieceEditor = new P.PieceEditor(this._width);
            rights.appendChild(this._pieceEditor.getDiv());
            let queueText = document.createElement("label");
            queueText.innerText = "Enter Queue Using Piece Number (ie. \"1,2,0,1,3,3,3,3,3\"): ";
            rights.appendChild(queueText);
            this._queueInput.setAttribute("type", "text");
            rights.appendChild(this._queueInput);
            rights.appendChild(document.createElement("br"));
            let generateMap = document.createElement("button");
            generateMap.innerText = "Generate Map";
            generateMap.onclick = this.genMap.bind(this);
            rights.appendChild(generateMap);
            let resetField = document.createElement("button");
            resetField.innerText = "Reset Field";
            resetField.onclick = this.drawTable.bind(this);
            rights.appendChild(resetField);
            row.appendChild(this._lefts);
            row.appendChild(rights);
            table.appendChild(row);
            this._mapDiv.appendChild(table);
            this.drawTable();
        }
        getDiv() {
            return this._mapDiv;
        }
        genMap() {
            if (this._pieceEditor.getPieces.length > 64) {
                alert("Too many pieces: Max 64");
                return;
            }
            let output = "";
            output += B.fromNumber(this._width) + "&";
            for (let p of this._pieceEditor.getPieces()) {
                output += B.pad(p.name, ' ', 1);
                let b = "";
                for (let i of p.getRenderShape()) {
                    b += Number(i !== -1);
                }
                output += B.binaryTo64(b).padEnd(5, '0');
                output += B.fromNumber(p.offset);
                output += B.pad(B.hexTo64(p.color.toString(16)), '0', 4);
            }
            output += "&";
            let queue = [];
            try {
                queue = this._queueInput.value.split(',').map(Number);
                if (queue.length < 2) {
                    throw new Error("Not enough pieces in the queue!");
                }
                for (let i of queue) {
                    if (i >= this._pieceEditor.getPieces().length || i < 0) {
                        throw new Error("Invalid Queue");
                    }
                    output += B.fromNumber(i);
                    ;
                }
            }
            catch (err) {
                alert(err.message);
                return;
            }
            output += "&";
            let map = "";
            for (let i = 0; i < this._blocks.length; ++i) {
                map += (Number(this._blocks[i].checked));
            }
            output += B.binaryTo64(map);
            output += "&";
            if (confirm("Go to map?")) {
                window.open('/map.html?' + output);
            }
        }
        widthInput() {
            if (!isNaN(Number(this._widthSlider.value))) {
                this._widthText.innerText = "Width: " + Number(this._widthSlider.value);
            }
        }
        drawTable() {
            let temp = this._width;
            this._width = Number(this._widthSlider.value);
            try {
                this._pieceEditor.setWidth(this._width);
            }
            catch (err) {
                alert(err);
                this._width = temp;
            }
            for (var i = this._mapTable.children.length - 1; i >= 0; --i) {
                this._mapTable.removeChild(this._mapTable.children[i]);
            }
            this._blocks = [];
            let mapR;
            for (let i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                if (i % this._width === 0) {
                    mapR = document.createElement("tr");
                    this._mapTable.appendChild(mapR);
                }
                let b = new C.Checkbox(24);
                this._blocks.push(b);
                mapR.appendChild(b.getTD());
            }
            this._lefts.appendChild(this._mapTable);
        }
    }
    M.MapEditor = MapEditor;
    function init() {
        D.Drag.init();
        let map = new MapEditor();
        document.body.appendChild(map.getDiv());
    }
    M.init = init;
})(M || (M = {}));
var B;
(function (B) {
    const _Rixits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    function fromNumber(num) {
        let rixit;
        let residual = num;
        let result = '';
        while (true) {
            rixit = residual % 64;
            result = _Rixits.charAt(rixit) + result;
            residual = Math.floor(residual / 64);
            if (residual == 0) {
                break;
            }
        }
        return result;
    }
    B.fromNumber = fromNumber;
    function toNumber(s) {
        let result = 0;
        let rix = s.split('');
        for (let e = 0; e < rix.length; ++e) {
            result = (result * 64) + _Rixits.indexOf(rix[e]);
        }
        return result;
    }
    B.toNumber = toNumber;
    function binaryTo64(n) {
        n = n.padStart(Math.ceil(n.length / 6) * 6, "0");
        let s = "";
        let bin = n.match(/.{1,6}/g);
        for (let b of bin) {
            s += fromNumber(parseInt(b, 2));
        }
        return s;
    }
    B.binaryTo64 = binaryTo64;
    function binaryFrom64(n) {
        let s = "";
        for (let b of n.split('')) {
            s += toNumber(b).toString(2).padStart(6, '0');
        }
        return s;
    }
    B.binaryFrom64 = binaryFrom64;
    function hexTo64(n) {
        let bin = parseInt(n, 16);
        return fromNumber(bin);
    }
    B.hexTo64 = hexTo64;
    function hexFrom64(n) {
        let b = toNumber(n);
        return b.toString(16);
    }
    B.hexFrom64 = hexFrom64;
    function pad(toPad, padChar, padnum) {
        let p = "";
        for (let i = 0; i < padnum; ++i) {
            p += padChar;
        }
        p += toPad;
        return p.slice(-padnum);
    }
    B.pad = pad;
})(B || (B = {}));
var SETTINGS;
(function (SETTINGS) {
    const VERSION = 0.002;
    class Settings {
        static init(map = false) {
            Settings._map = map;
            let pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
                new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];
            Settings._config = new ASC.Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], 100, 10, 7);
            Settings._pieceEditor = new P.PieceEditor(Settings._config._width, pieces);
            D.Drag.init();
            let settings = document.createElement("div");
            settings.style.border = "1px solid black";
            let title = document.createElement("H1");
            title.innerText = "Settings";
            settings.appendChild(title);
            let widthText = document.createElement("label");
            widthText.innerText = "Width: " + Settings._config._width.toString();
            settings.appendChild(widthText);
            settings.appendChild(document.createElement("br"));
            Settings._widthSlider = document.createElement("input");
            Settings._widthSlider.setAttribute("type", "range");
            Settings._widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
            Settings._widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
            Settings._widthSlider.setAttribute("value", "10");
            Settings._widthSlider.oninput = function () {
                if (!isNaN(Number(Settings._widthSlider.value))) {
                    let temp = Settings._config._width;
                    Settings._config._width = Number(Settings._widthSlider.value);
                    try {
                        Settings._pieceEditor.setWidth(Settings._config._width);
                    }
                    catch (err) {
                        alert(err);
                        Settings._config._width = temp;
                    }
                    widthText.innerText = "Width: " + Settings._config._width.toString();
                }
            };
            settings.appendChild(Settings._widthSlider);
            let controlsTitle = document.createElement("H2");
            controlsTitle.innerText = "Controls:";
            settings.appendChild(controlsTitle);
            let controlTable = document.createElement("table");
            const labels = ["Right", "Soft Drop", "Left", "CW", "CCW", "180", "Hold", "Hard Drop", "Instant Drop", "Restart"];
            let controlsBox = [];
            let row;
            for (let i = 0; i < labels.length; ++i) {
                if (i % 4 === 0) {
                    row = document.createElement("tr");
                    row.setAttribute("align", "left");
                    controlTable.appendChild(row);
                }
                let item = document.createElement("td");
                item.innerText = labels[i];
                let numcontain = document.createElement("td");
                let numberbox = document.createElement("input");
                numberbox.setAttribute("type", "number");
                numberbox.readOnly = true;
                numberbox.setAttribute("value", Settings._config._controls[i].toString());
                numberbox.onkeydown = function (event) {
                    if (event.keyCode !== 27) {
                        numberbox.value = event.keyCode.toString();
                        Settings._config._controls[i] = event.keyCode;
                    }
                    numberbox.blur();
                };
                numcontain.appendChild(numberbox);
                controlsBox.push(numberbox);
                row.appendChild(item);
                row.appendChild(numcontain);
            }
            settings.appendChild(controlTable);
            let delayText = document.createElement("label");
            delayText.innerText = "Delay: ";
            settings.appendChild(delayText);
            let delay = document.createElement("input");
            delay.setAttribute("type", "number");
            delay.setAttribute("min", "1");
            delay.setAttribute("value", Settings._config._delay.toString());
            delay.oninput = function () {
                if (!isNaN(Number(delay.value))) {
                    Settings._config._delay = Number(delay.value);
                }
            };
            settings.appendChild(delay);
            let repeatText = document.createElement("label");
            repeatText.innerText = "Repeat: ";
            settings.appendChild(repeatText);
            let repeat = document.createElement("input");
            repeat.setAttribute("type", "number");
            repeat.setAttribute("min", "1");
            repeat.setAttribute("value", Settings._config._repeat.toString());
            repeat.oninput = function () {
                if (!isNaN(Number(repeat.value))) {
                    Settings._config._repeat = Number(repeat.value);
                }
            };
            settings.appendChild(repeat);
            let bagText = document.createElement("label");
            bagText.innerText = "Bag: ";
            settings.appendChild(bagText);
            let bag = document.createElement("input");
            bag.setAttribute("type", "number");
            bag.setAttribute("min", "0");
            bag.setAttribute("value", Settings._config._bagSize.toString());
            bag.oninput = function () {
                if (!isNaN(Number(repeat.value))) {
                    Settings._config._bagSize = Number(bag.value);
                }
            };
            settings.appendChild(bag);
            settings.appendChild(document.createElement("hr"));
            settings.appendChild(Settings._pieceEditor.getDiv());
            let apply = document.createElement("button");
            apply.innerText = "Apply Settings";
            apply.onclick = function () {
                Settings._config._pieces = Settings._pieceEditor.getPieces();
                console.log(Settings._mapShape);
                Settings.restartGame();
                Settings.saveCookie();
            };
            settings.appendChild(apply);
            document.body.appendChild(settings);
            if (map) {
                Settings.loadMap();
            }
            if (document.cookie !== "") {
                Settings.readCookie();
                for (let i = 0; i < controlsBox.length; ++i) {
                    controlsBox[i].setAttribute("value", Settings._config._controls[i].toString());
                }
                delay.setAttribute("value", Settings._config._delay.toString());
                repeat.setAttribute("value", Settings._config._repeat.toString());
                RUN.afterLoad = () => (Settings.restartGame());
            }
        }
        static restartGame() {
            RUN.startGame(Settings._config, Settings._map, Settings._staticQueue, Settings._mapShape);
        }
        static readCookie() {
            let vals = decodeURIComponent(document.cookie).split(";");
            vals = vals.filter(function (el) { return el; });
            try {
                for (let v of vals) {
                    if (v != null && v.length > 2) {
                        switch (v.charAt(0)) {
                            case 'v':
                                if (parseFloat(v.substring(2)) < VERSION) {
                                    if (confirm("Outdated Config version: " + v.substring(2) + " Latest: " + VERSION + "\n Press OK to reset to new config, cancel to keep old config (may have unexpected results)")) {
                                        this.saveCookie();
                                    }
                                }
                            case 'p':
                                if (!Settings._map) {
                                    let p = ASC.Config.pieceFromText(v.substring(2));
                                    Settings._config._pieces = p;
                                    Settings._pieceEditor.setPieces(p);
                                }
                                break;
                            case 'b':
                                if (!Settings._map) {
                                    Settings._config._bagSize = JSON.parse(v.substring(2));
                                }
                                break;
                            case 'c':
                                Settings._config._controls = JSON.parse(v.substring(2));
                                break;
                            case 'r':
                                Settings._config._repeat = JSON.parse(v.substring(2));
                                break;
                            case 'd':
                                Settings._config._delay = JSON.parse(v.substring(2));
                                break;
                        }
                    }
                }
            }
            catch (err) {
                alert("Corrupted cookies: " + err.message);
            }
        }
        static saveCookie() {
            let c = "";
            c += "ver=" + VERSION.toString() + ";";
            if (!Settings._map) {
                c += "p=" + JSON.stringify(Settings._config._pieces) + ";";
            }
            c += "c=" + JSON.stringify(Settings._config._controls) + ";";
            c += "r=" + JSON.stringify(Settings._config._repeat) + ";";
            c += "d=" + JSON.stringify(Settings._config._delay) + ';';
            if (!Settings._map) {
                c += "b=" + JSON.stringify(Settings._config._bagSize) + ";";
            }
            c += "Expires: 2147483647;";
            document.cookie = encodeURIComponent(c);
        }
        static loadMap() {
            Settings._widthSlider.disabled = true;
            Settings._pieceEditor.disable(true);
            let m = window.location.search.substring(1);
            let cfg = m.split("&");
            Settings._config._width = B.toNumber(cfg[0]);
            let pc = [];
            let rawp = cfg[1].match(/.{1,11}/g);
            for (let r of rawp) {
                let shape = [];
                let i = 0;
                let sss = B.binaryFrom64(r.substring(1, 6));
                for (let s of sss.substring(5).split('')) {
                    if (Number(s) == 1) {
                        shape.push(i);
                    }
                    i++;
                }
                pc.push(new ASC.Piece(r.substring(0, 1), shape, B.toNumber(r.substring(6, 7)), Number("0x" + B.hexFrom64(r.substring(7)).padStart(6, '0'))));
            }
            Settings._pieceEditor.setPieces(pc);
            Settings._config._pieces = pc;
            let queue = [];
            for (let q of cfg[2].split('')) {
                queue.push(B.toNumber(q));
            }
            Settings._staticQueue = queue;
            let map = [];
            let rawmap = B.binaryFrom64(cfg[3]);
            rawmap = rawmap.substring(rawmap.length - Settings._config._width * ASC.FIELD_HEIGHT);
            let i = 0;
            for (let r of rawmap.split('')) {
                if (Number(r) == 1) {
                    map.push(i);
                }
                i++;
            }
            Settings._mapShape = map;
            RUN.afterLoad = () => (Settings.restartGame());
        }
    }
    Settings._staticQueue = [];
    Settings._mapShape = [];
    Settings._map = false;
    SETTINGS.Settings = Settings;
})(SETTINGS || (SETTINGS = {}));
var NAV;
(function (NAV) {
    function init() {
        document.head.insertAdjacentHTML("afterend", `
<style>
.topnav {
  background-color: #333;
  overflow: hidden;
  font-size: 1.2em;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 0.8em 1em;
  text-decoration: none;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: #777;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #555;
  color:  #fcbf75;
  font-weight: bold;
}</style>`);
        document.body.insertAdjacentHTML("beforebegin", `
<div class="topnav">
  <a class="active" href="index.html">ASCENSION</a>
  <a href="game.html">Game</a>
  <a href="designer.html">Map Editor</a>
    <a href="https://discord.gg/GjScWEh" style="float: right;">Discord</a>
    </div>`);
    }
    NAV.init = init;
})(NAV || (NAV = {}));
var STYLE;
(function (STYLE) {
    function init() {
        document.head.insertAdjacentHTML("afterend", `
<style>

    * {
        touch-action: manipulation;
    }
    html {
        background-color:#000000;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
    }

    a:link {
      color: #ea2347;
    }

    a:visited {
      color: #ea2347;
    }

    a:hover {
      color: hotpink;
    }

    a:active {
      color: blue;
    }

    input {
        background-color: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        padding-left: 5px;
        border: 1px solid #DDDDDD;
    }
    input[type=number]{
        background-color: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        padding-left: 5px;
        width: 5rem;
        border: 1px solid #DDDDDD;
    }
    tr {
        margin: 0px;
        padding: 0px;
        border: 0px;
    }

    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    input[type=range] {
  -webkit-appearance: none;
  width: 60%;
  margin: 0.2px 0;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #333333;
  border-radius: 0px;
  border: 0px solid #010101;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -0.2px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #717171;
}
input[type=range]::-moz-range-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  background: #4d4d4d;
  border-radius: 0px;
  border: 0px solid #010101;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 60%;
  height: 25.6px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #292929;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type=range]::-ms-fill-upper {
  background: #4d4d4d;
  border: 0px solid #010101;
  border-radius: 0px;
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type=range]::-ms-thumb {
  box-shadow: 0px 0px 0px #ffffff, 0px 0px 0px #ffffff;
  border: 0px solid #fffffa;
  height: 26px;
  width: 26px;
  border-radius: 0px;
  background: #999999;
  cursor: pointer;
  height: 25.6px;
}
input[type=range]:focus::-ms-fill-lower {
  background: #4d4d4d;
}
input[type=range]:focus::-ms-fill-upper {
  background: #717171;
}
    select {
        border: 0;
        background: #333333;
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        font:
    }
    button {
background-color: #4CAF50; /* Green */
        color: #DDDDDD;
        font-family: Arial Black,Arial Bold,Gadget,sans-serif; 
        border: 1px solid #DDDDDD;
        background: #333333;
}

</style>`);
    }
    STYLE.init = init;
})(STYLE || (STYLE = {}));
var C;
(function (C) {
    class Checkbox {
        constructor(size = 16) {
            this._checked = false;
            this._disabled = false;
            this._td = document.createElement("td");
            this._td.height = size.toString();
            this._td.width = size.toString();
            this._td.onmousemove = this.move.bind(this);
            this._td.ondragover = (ev) => (ev.preventDefault());
            this._td.onmousedown = (ev) => { this.click(); ev.preventDefault(); };
            this._td.textContent = "";
            this._td.draggable = false;
            this.update();
        }
        getTD() {
            return this._td;
        }
        update() {
            this._td.style.backgroundColor = this._disabled ? "#000000" : this._checked ? "#DDDDDD" : "#333333";
        }
        click() {
            console.log("move");
            if (!this._disabled) {
                Checkbox._lastState = !this._checked;
                this._checked = Checkbox._lastState;
                this.update();
            }
        }
        move(ev) {
            console.log("move");
            var style = getComputedStyle(this._td);
            if (!this._disabled && D.Drag.mouseDown) {
                this._checked = Checkbox._lastState;
                this.update();
            }
        }
        get checked() {
            return this._checked;
        }
        set checked(value) {
            this._checked = value;
            this.update();
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(value) {
            this._disabled = value;
            this.update();
        }
    }
    Checkbox._lastState = false;
    C.Checkbox = Checkbox;
})(C || (C = {}));
//# sourceMappingURL=main.js.map