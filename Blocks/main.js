var ASC;
(function (ASC) {
    ASC.MAX_FIELD_WIDTH = 20;
    ASC.MIN_FIELD_WIDTH = 5;
    ASC.FIELD_HEIGHT = 25;
    let Rotations;
    (function (Rotations) {
        Rotations[Rotations["NONE"] = 0] = "NONE";
        Rotations[Rotations["CW"] = 1] = "CW";
        Rotations[Rotations["CWCW"] = 2] = "CWCW";
        Rotations[Rotations["CCW"] = 3] = "CCW"; //Stored CW,CWCW, CCW but for math start at 1
    })(Rotations = ASC.Rotations || (ASC.Rotations = {}));
    let Directions;
    (function (Directions) {
        Directions[Directions["UP"] = 0] = "UP";
        Directions[Directions["RIGHT"] = 1] = "RIGHT";
        Directions[Directions["DOWN"] = 2] = "DOWN";
        Directions[Directions["LEFT"] = 3] = "LEFT";
    })(Directions = ASC.Directions || (ASC.Directions = {}));
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
    })(Inputs = ASC.Inputs || (ASC.Inputs = {}));
    let State;
    (function (State) {
        State[State["ACTIVE"] = 0] = "ACTIVE";
        State[State["PAUSED"] = 1] = "PAUSED";
        State[State["WIN"] = 2] = "WIN";
        State[State["LOSE"] = 3] = "LOSE";
    })(State = ASC.State || (ASC.State = {}));
    let Mode;
    (function (Mode) {
        Mode[Mode["PRACTICE"] = 0] = "PRACTICE";
        Mode[Mode["MAP"] = 1] = "MAP";
        Mode[Mode["DIG"] = 2] = "DIG";
        Mode[Mode["VS"] = 3] = "VS";
    })(Mode = ASC.Mode || (ASC.Mode = {}));
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
/// <reference path="dragutil.ts" />
var P;
(function (P) {
    class PieceEditor {
        constructor(width = 12, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
            new ASC.Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new ASC.Piece("S", [7, 8, 11, 12], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)]) {
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
            //Update current piece
            let val = this._pieceSelect.selectedIndex;
            if (val !== this._pieceSelect.childElementCount - 1) {
                //Update checks
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
            //console.log("Cleared: " + this._code);
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
    class Config {
        constructor(w = 10, p = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], c = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], d = 100, r = 10, b = 7) {
            //RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
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
            console.log(input);
            let p = JSON.parse(input);
            let ps = [];
            for (let i of p) {
                ps.push(new ASC.Piece(i._name, i._shape, i._offset, i._color));
            }
            return ps;
        }
        get width() {
            return this._width;
        }
        set width(value) {
            if (value != undefined && value >= ASC.MIN_FIELD_WIDTH && value <= ASC.MAX_FIELD_WIDTH) {
                this._width = value;
            }
            else {
                throw new Error("Invalid width in config: " + value);
            }
        }
        get pieces() {
            return [...this._pieces].map(x => x.getCopy());
        }
        set pieces(value) {
            if (value != undefined && value.length > 0) {
                this._pieces = [...value].map(x => x.getCopy());
            }
            else {
                throw new Error("Invalid pieces in config: " + value);
            }
        }
        get controls() {
            return [...this._controls];
        }
        set controls(value) {
            if (value != undefined && value.length > 0) { // Check if == to controls i g; don't really matter since they will hinder themselves
                this._controls = [...value];
            }
            else {
                throw new Error("Invalid controls in config: " + value);
            }
        }
        get delay() {
            return this._delay;
        }
        set delay(value) {
            if (value != undefined && value > 0) {
                this._delay = value;
            }
            else {
                throw new Error("Invalid delay in config: " + value);
            }
        }
        get repeat() {
            return this._repeat;
        }
        set repeat(value) {
            if (value != undefined && value > 0) {
                this._repeat = value;
            }
            else {
                throw new Error("Invalid repeat in config: " + value);
            }
        }
        get bagSize() {
            return this._bagSize;
        }
        set bagSize(value) {
            if (value != undefined && value > 0) {
                this._bagSize = value;
            }
            else {
                throw new Error("Invalid bag size in config: " + value);
            }
        }
    }
    ASC.Config = Config;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class MapData {
        constructor(w, p, q, c, u) {
            this._clearable = [];
            this._width = 10;
            this._unclearable = [];
            this._queue = [];
            this._pieces = [];
            this._width = w;
            this._pieces = p;
            this._queue = q;
            this._clearable = c;
            this._unclearable;
        }
        get width() {
            return this._width;
        }
        get clearable() {
            return [...this._clearable];
        }
        get unclearable() {
            return [...this._unclearable];
        }
        get queue() {
            return [...this._queue];
        }
        get pieces() {
            return [...this._pieces].map(p => p.getCopy());
        }
    }
    ASC.MapData = MapData;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    //Representation of a block.
    class Block {
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
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
    //Representation of a game field.
    class Field {
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        constructor(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        //Initialzes the field with empty blocks.
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
        appendRow(row, yval) {
            //this._array.splice.apply(this._width * yval, ...row);
            //this._array.splice(0, row.length);
            let end = this._array.splice(yval * this._width);
            let temp = this._array.concat(row).concat(end);
            temp.splice(0, row.length);
            this._array = temp;
        }
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
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
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        setBlocks(indices, block) {
            for (let i of indices) {
                this._array[i] = block;
            }
        }
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
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
    class Piece {
        constructor(name, shape, offset = 0, color = 0xFFFFFF, initOrient = 0) {
            this._shape = []; //The shape of piece (array of indecies to be filled)
            this._orientations = []; //Precomputed orientations/rotations
            this._currentOrientation = 0; //Current orientation
            this._x = 0;
            this._y = 0;
            this._name = name.substr(0, 1).replace(/[^a-z0-9]+/gi, '').padStart(1, '_');
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
        get xy() {
            return [this._x, this._y];
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
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        next() {
            return this._seed = this._seed * 16807 % 2147483647;
        }
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        nextFloat() {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
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
    class AGarbage {
    }
    ASC.AGarbage = AGarbage;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Garbage extends ASC.AGarbage {
        // So garbage reduction is proportional to the number of holes
        // Reduction = % of holes:
        // attakc inverse % of holes
        constructor(seed, width, percentage) {
            super();
            this._prng = new ASC.PRNG(seed);
            this._width = width;
            if (percentage >= 0 && percentage < 100) {
                this._percentage = percentage;
            }
            else {
                throw new Error("Invalid Percentage: " + percentage);
            }
        }
        addGarbage(attack) {
            let g = [];
            let a = [];
            for (let i = 0; i < this._width; ++i) {
                if (i < this._percentage * this._width) {
                    a.push(1);
                }
                else {
                    a.push(0);
                }
            }
            this._prng.shuffleArray(a);
            for (let i = 0; i < attack * this._percentage + 0.1; ++i) {
                g.push(a);
            }
            return g;
        }
    }
    ASC.Garbage = Garbage;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    ASC.NUM_PREVIEWS = 6;
    class AQueue {
    }
    ASC.AQueue = AQueue;
})(ASC || (ASC = {}));
/// <reference path="Aqueue.ts" />
var ASC;
(function (ASC) {
    class Queue extends ASC.AQueue {
        constructor(seed, pieces, size = pieces.length) {
            super();
            this._queue = [];
            this._rng = new ASC.PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        generateQueue() {
            //Less pieces then previews
            //Add enoguh pieces until it's full
            while (this._queue.length < ASC.NUM_PREVIEWS) {
                let tempBag = [];
                //Make sure enough pieces for larger bag size than pieces
                while (tempBag.length < this._bagSize) {
                    this._bag.forEach((i) => tempBag.push(i.getCopy())); // Fill it with a copy
                }
                this._rng.shuffleArray(tempBag);
                for (let i of tempBag.slice(0, this._bagSize + 1)) {
                    this._queue.push(i);
                }
            }
            //Take the number of pieces for bag size
        }
        getQueue() {
            return this._queue.slice(0, ASC.NUM_PREVIEWS); //need to copy 
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
/// <reference path="Aqueue.ts" />
var ASC;
(function (ASC) {
    //TODO: Change queue from a bunch of copies to just indicies of to the piece hten copy when needed
    class StaticQueue extends ASC.AQueue {
        constructor(pieces, order) {
            super();
            this._queue = []; //Numbers for which piece
            this._bag = pieces;
            for (let i of order) {
                this._queue.push(this._bag[i].getCopy());
            }
        }
        getQueue() {
            return this._queue.slice(0, ASC.NUM_PREVIEWS); //need to copy 
        }
        getNext() {
            let temp = this._queue.splice(0, 1)[0];
            return temp;
        }
        hasNext() {
            return this._queue.length > 0;
        }
        blocksLeft() {
            return this._queue.length;
        }
    }
    ASC.StaticQueue = StaticQueue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    const CLEAR = -1; //Lines cleared -1
    const SPIN = 2;
    const PC = 6;
    //Multipliers for field width/ complexity / diversity
    //MINI
    //Combo
    //Perfect clear
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
    class Stopwatch {
        constructor() {
        }
        start() {
            this._active = true;
            this._start = performance.now();
            this._elapsed = 0;
        }
        stop() {
            this._elapsed = this.getTime();
            this._active = false;
        }
        resume() {
            this._start = performance.now();
            this._active = true;
        }
        getTime() {
            if (this._active) {
                return performance.now() - this._start + this._elapsed;
            }
            else {
                return this._elapsed;
            }
        }
    }
    ASC.Stopwatch = Stopwatch;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class Timer {
        constructor(length, interval, tick, end) {
            this._running = false;
            this._length = length;
            this._interval = interval;
            this._tick = tick;
            this._end = end;
        }
        start() {
            this.stop();
            this._running = true;
            this._expected = performance.now() + this._length;
            this._expectedTick = performance.now() + this._interval;
            this._request = window.requestAnimationFrame(this.step.bind(this));
        }
        stop() {
            this._running = false;
            window.cancelAnimationFrame(this._request);
        }
        step() {
            if (this._running) {
                if (performance.now() >= this._expectedTick) {
                    this._expectedTick = performance.now() + this._interval;
                    this._tick();
                }
                else if (performance.now() >= this._expected) {
                    this.stop();
                    this._end();
                    return;
                }
                window.requestAnimationFrame(this.step.bind(this));
            }
        }
    }
    ASC.Timer = Timer;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    const KICKVER = 1;
    class AGame {
        constructor(width = 12, bagSize = 7, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new ASC.Piece("S", [7, 8, 11, 12], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay = 100, repeat = 10) {
            this._pieces = [];
            this._state = ASC.State.LOSE;
            if (delay < 1) {
                throw new Error("Invalid Delay");
            }
            if (repeat < 1) {
                throw new Error("Invalid Repeat");
            }
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
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
            this._time = new ASC.Stopwatch();
        }
        randomSeed() {
            this._seed = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
        }
        //public static replay(replay: string): AGame {
        //   le
        //}
        resetGame(seed) {
            if (seed != undefined) {
                this._seed = seed;
            }
            else {
                this.randomSeed();
            }
            this._field = new ASC.Field(this._width);
            this._hold = undefined;
            this.next();
            this._state = ASC.State.ACTIVE;
            this._time.start();
            this._inputs = [];
            this.update();
        }
        gameOver() {
            console.log(JSON.stringify(this._seed) + "; " + this._inputs.join());
            this._state = ASC.State.LOSE;
            this._time.stop();
            this.update();
        }
        next() {
            if (this._queue.hasNext()) {
                this._currentPiece = this._queue.getNext();
                if (!this.checkShift(0, 0)) {
                    this.gameOver();
                }
            }
            else {
                this.gameOver();
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
                if (block == null || //Up, Down bounds
                    yvals[i] != ~~((coords[i] + x) / this._width) || //Left, Right wrapping bounds
                    block.solid //Colliding with a block
                ) {
                    return false;
                }
            }
            return true;
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
        rotate(dir) {
            this._currentPiece.rotate(dir);
            if (this.checkShift(0, 0)) {
                return; //Successful natural rotation
            }
            if (dir !== ASC.Rotations.CWCW) { //No 180 kicks
                let sign = (dir - 2); // - for cw + for ccw for now.
                //Kick table, maybe change order to generalize
                console.log("Trying to kick:");
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
                let indexxx = [13, 17, 18, 22, 23, 19, 24, 14, 11, 7, 11, 8, 9, 2, 3];
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
        lock() {
            this._field.setBlocks(this._currentPiece.getCoords(this._width), new ASC.Block(this._currentPiece.color, true, true));
            this.next();
        }
        update() {
            this.updateField();
            this._updateQueueCallback(this._queue.getQueue());
            this._updateHoldCallback(this._hold);
            this._updateCallback();
        }
        updateField() {
            let temp = this._field.getColors();
            let current = this._currentPiece.getCopy();
            this.sonicDrop();
            let ghost = this._currentPiece.getCopy();
            this._currentPiece = current;
            this._updateFieldCallback(temp, current.getCopy(), ghost);
        }
        appendRow(rows, yval) {
            for (let r of rows) {
                this._field.appendRow(r, yval);
            }
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
        setUpdate(u) {
            this._updateCallback = u;
        }
        setUpdateHold(u) {
            this._updateHoldCallback = u;
        }
        setUpdateQueue(u) {
            this._updateQueueCallback = u;
        }
        setUpdateField(u) {
            this._updateFieldCallback = u;
        }
        get time() {
            return this._time.getTime();
        }
        get state() {
            return this._state;
        }
        readinput(input) {
            if (this._state == ASC.State.ACTIVE) {
                switch (input) {
                    case ASC.Inputs.CW:
                        this._inputs.push(input);
                        this.rotate(ASC.Rotations.CW);
                        break;
                    case ASC.Inputs.RIGHT:
                        this._inputs.push(input);
                        this.move(ASC.Directions.RIGHT);
                        break;
                    case ASC.Inputs.SD:
                        this._inputs.push(input);
                        this.move(ASC.Directions.DOWN);
                        break;
                    case ASC.Inputs.LEFT:
                        this._inputs.push(input);
                        this.move(ASC.Directions.LEFT);
                        break;
                    case ASC.Inputs.CCW:
                        this._inputs.push(input);
                        this.rotate(ASC.Rotations.CCW);
                        break;
                    case ASC.Inputs.CWCW:
                        this._inputs.push(input);
                        this.rotate(ASC.Rotations.CWCW);
                        break;
                    case ASC.Inputs.HD:
                        this._inputs.push(input);
                        this.hardDrop();
                        break;
                    case ASC.Inputs.HOLD:
                        this._inputs.push(input);
                        this.hold();
                        break;
                    case ASC.Inputs.SONIC:
                        this._inputs.push(input);
                        this.sonicDrop();
                        break;
                    default:
                        break;
                }
            }
            this.update(); //remove this and only update when needed
        }
    }
    ASC.AGame = AGame;
})(ASC || (ASC = {}));
/// <reference path="agame.ts" />
var ASC;
(function (ASC) {
    class DigGame extends ASC.AGame {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width = 10, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._attack = new ASC.AttackTable(this._width);
            this._timer = new ASC.Timer(120000, 2000, this.tick.bind(this), this.win.bind(this));
        }
        resetGame(seed) {
            this._progress = 0;
            if (seed != undefined) {
                this._seed = seed;
            }
            else {
                this.randomSeed();
            }
            this._garbage = new ASC.Garbage(this._seed, this._width, 0.9);
            this._queue = new ASC.Queue(this._seed, this._pieces, this._bagSize);
            super.resetGame(this._seed);
        }
        tick() {
            this.addGarbage(~~(Math.random() * 4));
            this.update();
        }
        win() {
            super.gameOver();
            this._state = ASC.State.WIN;
        }
        lock() {
            let spin = this.checkImmobile();
            let yvals = this._currentPiece.getYVals();
            super.lock();
            let cleared = this.clearLines(yvals);
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
        }
        addGarbage(attack = 1) {
            let garbage = [];
            let g = this._garbage.addGarbage(attack);
            for (let row of g) {
                garbage.push([]);
                for (let b of row) {
                    if (b == 1) {
                        garbage[garbage.length - 1].push(new ASC.Block(0xDDDDDD, true, true));
                    }
                    else {
                        garbage[garbage.length - 1].push(new ASC.Block(0x000000, false, false));
                    }
                }
            }
            super.appendRow(garbage, ASC.FIELD_HEIGHT);
            this.checkGarbageShift();
        }
        checkGarbageShift() {
            let y = 0;
            let highest = this._currentPiece.getYVals().sort(function (a, b) { return a - b; })[0];
            while (!this.checkShift(0, y)) {
                --y;
                if (highest + y == 0) {
                    this.hardDrop();
                    return;
                }
                else if (highest + y < 0) {
                    this.gameOver();
                    return;
                }
            }
            this._currentPiece.move(0, y);
        }
    }
    ASC.DigGame = DigGame;
})(ASC || (ASC = {}));
/// <reference path="agame.ts" />
var ASC;
(function (ASC) {
    //TODO:
    //Score
    const TIMELIMIT = 60;
    class Game extends ASC.AGame {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width = 12, bagSize = 7, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._attack = new ASC.AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
        }
        resetGame(seed) {
            this._progress = 0;
            if (seed != undefined) {
                this._seed = seed;
            }
            else {
                this.randomSeed();
            }
            this._queue = new ASC.Queue(this._seed, this._pieces, this._bagSize);
            super.resetGame(this._seed);
        }
        lock() {
            let spin = this.checkImmobile();
            let yvals = this._currentPiece.getYVals();
            super.lock();
            let cleared = this.clearLines(yvals);
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
        }
    }
    ASC.Game = Game;
})(ASC || (ASC = {}));
/// <reference path="agame.ts" />
var ASC;
(function (ASC) {
    //TODO:
    //Score
    const TIMELIMIT = 60;
    class MapGame extends ASC.AGame {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width = 12, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], order = [], clearable = [], unclearable = [], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._map = clearable;
            this._solid = unclearable;
            this._order = order;
            this._attack = new ASC.AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
        }
        resetGame(seed) {
            this._queue = new ASC.StaticQueue(this._pieces, this._order);
            this._progress = 0;
            super.resetGame(seed);
            this._field.setBlocks(this._map, new ASC.Block(0xDDDDDD, true, true));
            this.update();
        }
        lock() {
            let spin = this.checkImmobile();
            let yvals = this._currentPiece.getYVals();
            super.lock();
            let cleared = this.clearLines(yvals);
            if (cleared > 0) {
                if (spin) {
                    this._progress += this._attack.spin(cleared);
                }
                else {
                    this._progress += this._attack.clear(cleared);
                }
                if (this.checkPC()) {
                    this._progress += this._attack.perfectClear(cleared);
                    this.gameOver();
                    this._state = ASC.State.WIN;
                }
            }
        }
    }
    ASC.MapGame = MapGame;
})(ASC || (ASC = {}));
/// <reference path="pieceeditor.ts" />
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
            // Store map info in the following format:
            //Width |&|Pieces <- ouch|&|Queue|&| Map
            //Width = Single base 64 character (5-20)
            //Pieces 10 chars {Name(1)|Shape(5)|offset(1)|Color(4)}
            //Queue = Numbers encoded into base 64
            //Map = Convert map into binary number (max length is 500 1's), then change to base 64 -> theoretically only 70ish chars
            //Width, 1 char
            output += B.fromNumber(this._width) + "&";
            //Piece, 11 char * n pieces 
            for (let p of this._pieceEditor.getPieces()) {
                output += B.pad(p.name, ' ', 1); //1  //PAD
                let b = "";
                for (let i of p.getRenderShape()) {
                    b += Number(i !== -1);
                }
                output += B.binaryTo64(b).padEnd(5, '0');
                output += B.fromNumber(p.offset); // 1
                output += B.pad(B.hexTo64(p.color.toString(16)), '0', 4); //4 //PAD (change these to pad start smh)
            }
            output += "&";
            //1 * n
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
            let map = ""; //PAD 
            for (let i = 0; i < this._blocks.length; ++i) {
                map += (Number(this._blocks[i].checked));
            }
            //output += B.pad(B.binaryTo64(map), '0', Math.ceil((this._width * ASC.FIELD_HEIGHT) / 6));
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
  <a href="dig.html">Dig Modeᵇᵉᵗᵃ</a>
    <a href="https://discord.gg/GjScWEh" style="float: right;">Discord</a>
    </div>`);
    }
    NAV.init = init;
})(NAV || (NAV = {}));
var B;
(function (B) {
    //Convert numbers chunks at a time
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
            //Epic ternary 
            this._td.style.backgroundColor = this._disabled ? "#000000" : this._checked ? "#DDDDDD" : "#333333";
        }
        click() {
            if (!this._disabled) {
                Checkbox._lastState = !this._checked;
                this._checked = Checkbox._lastState;
                this.update();
            }
        }
        move(ev) {
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
var H;
(function (H) {
    class Title {
    }
    H.Title = Title;
})(H || (H = {}));
