var ASC;
(function (ASC) {
    class GameManager {
        constructor(c, mode, mapdata) {
            this._visible = true;
            this._config = c;
            this._mapdata = mapdata;
            switch (mode) {
                case ASC.Mode.PRACTICE:
                    this._game = new ASC.Game(this._config.width, this._config.bagSize, this._config.pieces, this._config.delay, this._config.repeat);
                    break;
                case ASC.Mode.MAP:
                    this._game = new ASC.MapGame(this._mapdata.width, this._config.bagSize, mapdata.pieces, this._mapdata.queue, this._mapdata.clearable, this._mapdata.unclearable, this._config.delay, this._config.repeat);
                    break;
                case ASC.Mode.DIG:
                    this._game = new ASC.DigGame(this._config.width, this._config.bagSize, this._config.pieces, this._config.delay, this._config.repeat);
                    break;
                case ASC.Mode.VS:
                    break;
            }
            this._controls = this._config.controls;
            this._renderer = new ASC.Renderer(this._config.width, "Attack");
            for (var i = RUN.app.stage.children.length - 1; i >= 0; --i) {
                RUN.app.stage.removeChild(RUN.app.stage.children[i]);
            }
            ASC.InputManager.RegisterObserver(this);
            ASC.InputManager.RegisterKeys(this, [this._config.controls[ASC.Inputs.LEFT], this._config.controls[ASC.Inputs.RIGHT], this._config.controls[ASC.Inputs.SD]], this._config.delay, this._config.repeat);
            RUN.app.stage.addChild(this._renderer);
            this._game.setUpdate(this.updateGame.bind(this));
            this._game.setUpdateHold(this.updateHold.bind(this));
            this._game.setUpdateQueue(this.updateQueue.bind(this));
            this._game.setUpdateField(this.updateField.bind(this));
        }
        resetGame() {
            this._game.resetGame();
        }
        updateGame() {
            this._renderer.updateTime((this._game.time / 1000).toString());
        }
        updateHold(hold) {
            if (hold === undefined) {
                let temp = [];
                for (let i = 0; i < 25; ++i) {
                    temp.push(0x000000);
                }
                this._renderer.updateHold(temp);
            }
            else {
                this._renderer.updateHold(hold.getRenderShape());
            }
        }
        updateQueue(queue) {
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
        updateField(temp, current, ghost) {
            if (current != undefined) {
                for (let point of ghost.getCoords(this._config.width)) {
                    temp[point] = (ghost.color & 0xfefefe) >> 1;
                    ;
                }
                for (let point of current.getCoords(this._config.width)) {
                    temp[point] = current.color;
                }
                for (let i = 0; i < 5; ++i) {
                    for (let j = 0; j < 5; ++j) {
                        let index = i + current.xy[0] + (j + current.xy[1]) * this._config.width;
                        if (i + current.xy[0] >= 0 && i + current.xy[0] < this._config.width &&
                            j + current.xy[1] >= 0 && j + current.xy[1] < ASC.FIELD_HEIGHT) {
                            if (i == 2 && j == 2) {
                                temp[index] = GameManager.darken(temp[index]);
                            }
                            else {
                                temp[index] = GameManager.lighten(temp[index]);
                            }
                        }
                    }
                }
            }
            this._renderer.updateField(temp);
        }
        static lighten(hex) {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.min(r + 50, 255);
            g = Math.min(g + 50, 255);
            b = Math.min(b + 50, 255);
            return r * 65536 + g * 256 + b;
        }
        static darken(hex) {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.max(r - 50, 0);
            g = Math.max(g - 50, 0);
            b = Math.max(b - 50, 0);
            return r * 65536 + g * 256 + b;
        }
        touchControl(code) {
            const touchMap = [ASC.Inputs.LEFT, ASC.Inputs.SD, ASC.Inputs.RIGHT, ASC.Inputs.CW, ASC.Inputs.CWCW, ASC.Inputs.CCW, ASC.Inputs.HD, ASC.Inputs.HOLD, ASC.Inputs.SONIC];
            if (this._game.state == ASC.State.ACTIVE) {
                this._game.readinput(touchMap.indexOf(code));
            }
            if (code == 9) {
                this.resetGame();
            }
        }
        Triggered(keyCode) {
            this._game.readinput(this._controls.indexOf(keyCode));
            switch (keyCode) {
                case this._controls[ASC.Inputs.RIGHT]:
                    ASC.InputManager.cancelRepeat(this._controls[ASC.Inputs.LEFT]);
                    break;
                case this._controls[ASC.Inputs.LEFT]:
                    ASC.InputManager.cancelRepeat(this._controls[ASC.Inputs.RIGHT]);
                    break;
                default:
                    break;
            }
            if (keyCode == this._controls[ASC.Inputs.RESTART]) {
                this.resetGame();
            }
        }
    }
    ASC.GameManager = GameManager;
})(ASC || (ASC = {}));
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
        document.body.insertBefore(RUN.app.view, document.body.childNodes[1]);
    }
    RUN.init = init;
    function startGame(config, mode, mapdata) {
        try {
            RUN.game = new ASC.GameManager(config, mode, mapdata);
        }
        catch (err) {
            alert("Error in config: " + err);
            RUN.game = new ASC.GameManager(new ASC.Config, ASC.Mode.PRACTICE);
        }
        RUN.game.resetGame();
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
        const lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold", "Instant Drop", "Restart"];
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
        Rotations[Rotations["CCW"] = 3] = "CCW";
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
var SETTINGS;
(function (SETTINGS) {
    const VERSION = 0.002;
    class Settings {
        static init(mode = 0) {
            Settings._mode = mode;
            let pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
                new ASC.Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new ASC.Piece("S", [7, 8, 11, 12], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];
            Settings._config = new ASC.Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], 100, 10, 7);
            Settings._pieceEditor = new P.PieceEditor(Settings._config.width, pieces);
            D.Drag.init();
            let settings = document.createElement("div");
            settings.style.border = "1px solid black";
            let title = document.createElement("H1");
            title.innerText = "Settings";
            settings.appendChild(title);
            let widthText = document.createElement("label");
            widthText.innerText = "Width: " + Settings._config.width.toString();
            settings.appendChild(widthText);
            settings.appendChild(document.createElement("br"));
            Settings._widthSlider = document.createElement("input");
            Settings._widthSlider.setAttribute("type", "range");
            Settings._widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
            Settings._widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
            Settings._widthSlider.setAttribute("value", "10");
            Settings._widthSlider.oninput = function () {
                if (!isNaN(Number(Settings._widthSlider.value))) {
                    let temp = Settings._config.width;
                    Settings._config.width = Number(Settings._widthSlider.value);
                    try {
                        Settings._pieceEditor.setWidth(Settings._config.width);
                    }
                    catch (err) {
                        alert(err);
                        Settings._config.width = temp;
                    }
                    widthText.innerText = "Width: " + Settings._config.width.toString();
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
                numberbox.setAttribute("value", Settings._config.controls[i].toString());
                numberbox.onkeydown = function (event) {
                    if (event.keyCode !== 27) {
                        numberbox.value = event.keyCode.toString();
                        Settings._config.controls[i] = event.keyCode;
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
            delay.setAttribute("value", Settings._config.delay.toString());
            delay.oninput = function () {
                if (!isNaN(Number(delay.value))) {
                    Settings._config.delay = Number(delay.value);
                }
            };
            settings.appendChild(delay);
            let repeatText = document.createElement("label");
            repeatText.innerText = "Repeat: ";
            settings.appendChild(repeatText);
            let repeat = document.createElement("input");
            repeat.setAttribute("type", "number");
            repeat.setAttribute("min", "1");
            repeat.setAttribute("value", Settings._config.repeat.toString());
            repeat.oninput = function () {
                if (!isNaN(Number(repeat.value))) {
                    Settings._config.repeat = Number(repeat.value);
                }
            };
            settings.appendChild(repeat);
            let bagText = document.createElement("label");
            bagText.innerText = "Bag: ";
            settings.appendChild(bagText);
            let bag = document.createElement("input");
            bag.setAttribute("type", "number");
            bag.setAttribute("min", "0");
            bag.setAttribute("value", Settings._config.bagSize.toString());
            bag.oninput = function () {
                if (!isNaN(Number(repeat.value))) {
                    Settings._config.bagSize = Number(bag.value);
                }
            };
            settings.appendChild(bag);
            settings.appendChild(document.createElement("hr"));
            settings.appendChild(Settings._pieceEditor.getDiv());
            let apply = document.createElement("button");
            apply.innerText = "Apply Settings";
            apply.onclick = function () {
                Settings._config.pieces = Settings._pieceEditor.getPieces();
                Settings.restartGame();
                Settings.saveCookie();
            };
            settings.appendChild(apply);
            document.body.appendChild(settings);
            if (document.cookie !== "") {
                Settings.readCookie();
                for (let i = 0; i < controlsBox.length; ++i) {
                    controlsBox[i].setAttribute("value", Settings._config.controls[i].toString());
                }
                delay.setAttribute("value", Settings._config.delay.toString());
                repeat.setAttribute("value", Settings._config.repeat.toString());
            }
            else {
                Settings.saveCookie();
            }
            if (mode == 1) {
                Settings.loadMap();
            }
            RUN.afterLoad = () => {
                Settings.restartGame();
            };
            RUN.init();
        }
        static restartGame() {
            RUN.startGame(Settings._config, Settings._mode, Settings._mapData);
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
                                break;
                            case 'p':
                                if (Settings._mode == 1) {
                                    let p = ASC.Config.pieceFromText(v.substring(2));
                                    Settings._config.pieces = p;
                                    Settings._pieceEditor.setPieces(p);
                                }
                                break;
                            case 'b':
                                if (Settings._mode == 1) {
                                    Settings._config.bagSize = JSON.parse(v.substring(2));
                                }
                                break;
                            case 'c':
                                Settings._config.controls = JSON.parse(v.substring(2));
                                break;
                            case 'r':
                                Settings._config.repeat = JSON.parse(v.substring(2));
                                break;
                            case 'd':
                                Settings._config.delay = JSON.parse(v.substring(2));
                                break;
                        }
                    }
                }
            }
            catch (err) {
                alert("Corrupted cookies: " + err.message);
                this.saveCookie();
            }
        }
        static saveCookie() {
            let c = "";
            c += "v=" + VERSION.toString() + ";";
            if (Settings._mode != 1) {
                c += "p=" + JSON.stringify(Settings._config.pieces) + ";";
            }
            c += "c=" + JSON.stringify(Settings._config.controls) + ";";
            c += "r=" + JSON.stringify(Settings._config.repeat) + ";";
            c += "d=" + JSON.stringify(Settings._config.delay) + ';';
            if (Settings._mode != 1) {
                c += "b=" + JSON.stringify(Settings._config.bagSize) + ";";
            }
            c += "Expires: 2147483647;";
            document.cookie = encodeURIComponent(c);
        }
        static loadMap() {
            Settings._widthSlider.disabled = true;
            Settings._pieceEditor.disable(true);
            let m = window.location.search.substring(1);
            let cfg = m.split("&");
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
            let queue = [];
            for (let q of cfg[2].split('')) {
                queue.push(B.toNumber(q));
            }
            let map = [];
            let rawmap = B.binaryFrom64(cfg[3]);
            rawmap = rawmap.substring(rawmap.length - Settings._config.width * ASC.FIELD_HEIGHT);
            let i = 0;
            for (let r of rawmap.split('')) {
                if (Number(r) == 1) {
                    map.push(i);
                }
                i++;
            }
            Settings._mapData = new ASC.MapData(B.toNumber(cfg[0]), pc, queue, map, []);
        }
    }
    Settings._staticQueue = [];
    Settings._mapShape = [];
    Settings._mode = ASC.Mode.PRACTICE;
    SETTINGS.Settings = Settings;
})(SETTINGS || (SETTINGS = {}));
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
        resetGame() {
            if (this._inputs != undefined) {
                console.log(JSON.stringify(this._seed) + "; " + this._inputs.join());
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
            this._state = ASC.State.LOSE;
            this.update();
        }
        next() {
            if (this._queue.hasNext()) {
                this._currentPiece = this._queue.getNext();
                if (!this.checkShift(0, 0)) {
                    this.gameOver();
                    this._state = ASC.State.LOSE;
                }
            }
            else {
                this.gameOver();
                this._state = ASC.State.LOSE;
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
                return;
            }
            if (dir !== ASC.Rotations.CWCW) {
                let sign = (dir - 2);
                console.log("Trying to kick:");
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
                        return;
                    }
                }
            }
            console.log("Failed Kick.");
            this._currentPiece.rotate(4 - dir);
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
            this.update();
        }
    }
    ASC.AGame = AGame;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    class DigGame extends ASC.AGame {
        constructor(width = 10, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._attack = new ASC.AttackTable(this._width);
            this._timer = new ASC.Timer(120000, 2000, this.tick.bind(this), this.win.bind(this));
        }
        resetGame() {
            this._progress = 0;
            this.randomSeed();
            this._garbage = new ASC.Garbage(this._seed, this._width, 0.9);
            this._queue = new ASC.Queue(this._seed, this._pieces, this._bagSize);
            super.resetGame();
            this._timer.start();
        }
        tick() {
            this.addGarbage(~~(Math.random() * 4));
            this.update();
        }
        gameOver() {
            this._timer.stop();
            super.gameOver();
        }
        win() {
            super.gameOver();
            this._timer.stop();
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
var ASC;
(function (ASC) {
    const TIMELIMIT = 60;
    class Game extends ASC.AGame {
        constructor(width = 12, bagSize = 7, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._attack = new ASC.AttackTable(this._width);
        }
        resetGame() {
            this._progress = 0;
            this.randomSeed();
            this._queue = new ASC.Queue(this._seed, this._pieces, this._bagSize);
            super.resetGame();
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
var ASC;
(function (ASC) {
    const TIMELIMIT = 60;
    class MapGame extends ASC.AGame {
        constructor(width = 12, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], order = [], clearable = [], unclearable = [], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, delay, repeat);
            this._progress = 0;
            this._map = clearable;
            this._solid = unclearable;
            this._order = order;
            this._attack = new ASC.AttackTable(this._width);
        }
        resetGame() {
            this._queue = new ASC.StaticQueue(this._pieces, this._order);
            this._progress = 0;
            super.resetGame();
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
        appendRow(row, yval) {
            let end = this._array.splice(yval * this._width);
            let temp = this._array.concat(row).concat(end);
            temp.splice(0, row.length);
            this._array = temp;
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
    ASC.NUM_PREVIEWS = 6;
    class AQueue {
    }
    ASC.AQueue = AQueue;
})(ASC || (ASC = {}));
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
    class StaticQueue extends ASC.AQueue {
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
        blocksLeft() {
            return this._queue.length;
        }
    }
    ASC.StaticQueue = StaticQueue;
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
    class Stopwatch {
        constructor() {
        }
        start() {
            this._start = performance.now();
        }
        getTime() {
            return performance.now() - this._start;
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
    class Config {
        constructor(w = 10, p = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], c = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], d = 100, r = 10, b = 7) {
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
            if (value != undefined && value.length > 0) {
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
    class MapConfig extends ASC.Config {
        constructor(w, p, c, d, r, b, map) {
            super(w, p, c, d, r, b);
            this._map = map;
        }
    }
    ASC.MapConfig = MapConfig;
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
//# sourceMappingURL=main.js.map