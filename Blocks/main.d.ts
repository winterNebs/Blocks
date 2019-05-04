declare namespace ASC {
    const MAX_FIELD_WIDTH: number;
    const MIN_FIELD_WIDTH: number;
    const FIELD_HEIGHT: number;
    enum Rotations {
        NONE = 0,
        CW = 1,
        CWCW = 2,
        CCW = 3
    }
    enum Directions {
        UP = 0,
        RIGHT = 1,
        DOWN = 2,
        LEFT = 3
    }
    enum Inputs {
        RIGHT = 0,
        SD = 1,
        LEFT = 2,
        CW = 3,
        CCW = 4,
        CWCW = 5,
        HOLD = 6,
        HD = 7,
        SONIC = 8,
        RESTART = 9
    }
    enum State {
        ACTIVE = 0,
        PAUSED = 1,
        WIN = 2,
        LOSE = 3
    }
    enum Mode {
        PRACTICE = 0,
        MAP = 1,
        DIG = 2,
        VS = 3
    }
}
declare namespace D {
    class Drag {
        static mouseDown: boolean;
        static lastState: boolean;
        static lastSelected: HTMLInputElement;
        static init(): void;
    }
}
declare namespace P {
    class PieceEditor {
        private _pieceDiv;
        private _pieces;
        private _width;
        private _pieceSelect;
        private _checks;
        private _pieceNameInput;
        private _pieceColor;
        private _offsetSlider;
        private _offsetText;
        private _addPiece;
        private _removePiece;
        constructor(width?: number, pieces?: ASC.Piece[]);
        private removePieceClick;
        private addPieceClick;
        private offsetUpdate;
        private updateList;
        private displayPiece;
        private cth;
        getDiv(): HTMLDivElement;
        setWidth(width: number): void;
        getPieces(): ASC.Piece[];
        disable(state: boolean): void;
        setPieces(p: ASC.Piece[]): void;
    }
}
declare namespace ASC {
    interface ITriggerObserver {
        Triggered(keyCode: number): void;
    }
}
declare namespace ASC {
    enum Keys {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        S = 83,
        D = 68,
        SPACE = 32,
        SHIFT = 16
    }
    class InputManager {
        private static _keys;
        private static _keyCodes;
        private static _observers;
        private constructor();
        private static _focus;
        static setFocus(f: boolean): void;
        static initialize(): void;
        private static onKeyDown;
        private static onKeyUp;
        static RegisterKeys(Observer: ITriggerObserver, keyCodes: number[], delay: number, repeat: number): void;
        static RegisterObserver(Observer: ITriggerObserver): void;
        static UnregisterObserver(Observer: ITriggerObserver): void;
        private static NotifyObservers;
        static cancelRepeat(keycode: number): void;
    }
}
declare namespace ASC {
    class Config {
        private _width;
        private _pieces;
        private _controls;
        private _delay;
        private _repeat;
        private _bagSize;
        constructor(w?: number, p?: Piece[], c?: number[], d?: number, r?: number, b?: number);
        static fromText(input: string): Config;
        static pieceFromText(input: string): Piece[];
        width: number;
        pieces: ASC.Piece[];
        controls: number[];
        delay: number;
        repeat: number;
        bagSize: number;
    }
}
declare namespace ASC {
}
declare namespace ASC {
    class MapData {
        private _clearable;
        private _width;
        private _unclearable;
        private _queue;
        private _pieces;
        constructor(w: number, p: Piece[], q: number[], c: number[], u: number[]);
        readonly width: number;
        readonly clearable: number[];
        readonly unclearable: number[];
        readonly queue: number[];
        readonly pieces: Piece[];
    }
}
declare namespace ASC {
    class Block {
        private _color;
        private _solid;
        private _clearable;
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
        constructor(color?: number, solid?: boolean, clearable?: boolean);
        readonly color: number;
        readonly solid: boolean;
        readonly clearable: boolean;
    }
}
declare namespace ASC {
    class Field {
        private _width;
        private _array;
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        constructor(width: number);
        private initialize;
        private shift;
        appendRow(row: Block[], yval: number): void;
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        getAt(index: number): Block;
        getColors(): number[];
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        setBlocks(indices: number[], block: Block): void;
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        clearLineAt(yval: number): void;
    }
}
declare namespace ASC {
    class Piece {
        private _name;
        private _shape;
        private _orientations;
        private _offset;
        private _initialOrientation;
        private _currentOrientation;
        private _x;
        private _y;
        private _blockCount;
        private _color;
        constructor(name: string, shape: number[], offset?: number, color?: number, initOrient?: number);
        validateOffset(width: number): boolean;
        initRotations(): void;
        private setShape;
        rotate(dir: Rotations): void;
        move(x: number, y: number): void;
        getCoords(width: number): number[];
        getYVals(): number[];
        reset(): void;
        getCopy(): Piece;
        getRenderShape(): number[];
        readonly name: string;
        readonly color: number;
        readonly offset: number;
        readonly xy: number[];
    }
}
declare namespace ASC {
    class PRNG {
        private _seed;
        constructor(seed: number);
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        next(): number;
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        nextFloat(): number;
        shuffleArray(array: any): void;
    }
}
declare namespace ASC {
    abstract class AGarbage {
        abstract addGarbage(attack: number): number[][];
    }
}
declare namespace ASC {
    class Garbage extends AGarbage {
        private _width;
        private _percentage;
        private _prng;
        constructor(seed: number, width: number, percentage: number);
        addGarbage(attack: number): number[][];
    }
}
declare namespace ASC {
    const NUM_PREVIEWS = 6;
    abstract class AQueue {
        abstract getQueue(): Piece[];
        abstract getNext(): Piece;
        abstract hasNext(): boolean;
    }
}
declare namespace ASC {
    class Queue extends AQueue {
        private _bag;
        private _bagSize;
        private _queue;
        private _rng;
        constructor(seed: number, pieces: Piece[], size?: number);
        private generateQueue;
        getQueue(): Piece[];
        getNext(): Piece;
        hasNext(): boolean;
    }
}
declare namespace ASC {
    class StaticQueue extends AQueue {
        private _bag;
        private _queue;
        constructor(pieces: Piece[], order: number[]);
        getQueue(): Piece[];
        getNext(): Piece;
        hasNext(): boolean;
        blocksLeft(): number;
    }
}
declare namespace ASC {
    class AttackTable {
        private _width;
        constructor(width: number);
        clear(num: number): number;
        spin(num: number): number;
        perfectClear(num: number): number;
        private widthMultiplier;
    }
}
declare namespace ASC {
}
declare namespace ASC {
    class Stopwatch {
        private _start;
        private _active;
        private _elapsed;
        constructor();
        start(): void;
        stop(): void;
        resume(): void;
        getTime(): number;
    }
}
declare namespace ASC {
    class Timer {
        private _running;
        private _request;
        private _expected;
        private _expectedTick;
        private _length;
        private _interval;
        private _tick;
        private _end;
        constructor(length: number, interval: number, tick: Function, end: Function);
        start(): void;
        stop(): void;
        private step;
    }
}
declare namespace ASC {
    abstract class AGame {
        protected _field: Field;
        protected _currentPiece: Piece;
        protected _hold: Piece;
        protected _queue: AQueue;
        protected _width: number;
        protected _bagSize: number;
        protected _pieces: Piece[];
        protected _controls: number[];
        protected _state: State;
        protected _seed: number;
        private _time;
        private _inputs;
        private _updateCallback;
        private _updateHoldCallback;
        private _updateQueueCallback;
        private _updateFieldCallback;
        constructor(width?: number, bagSize?: number, pieces?: Piece[], delay?: number, repeat?: number);
        protected randomSeed(): void;
        resetGame(seed?: number): void;
        protected gameOver(): void;
        protected next(): void;
        protected hold(): void;
        protected hardDrop(): void;
        protected sonicDrop(): void;
        protected move(dir: Directions): void;
        protected checkShift(x: number, y: number): boolean;
        protected checkPC(): boolean;
        protected checkImmobile(): boolean;
        protected rotate(dir: Rotations): void;
        protected lock(): void;
        update(): void;
        private updateField;
        protected appendRow(rows: Block[][], yval: number): void;
        protected clearLines(yvals: number[]): number;
        setUpdate(u: Function): void;
        setUpdateHold(u: Function): void;
        setUpdateQueue(u: Function): void;
        setUpdateField(u: Function): void;
        readonly time: number;
        readonly state: State;
        readinput(input: Inputs): void;
    }
}
declare namespace ASC {
    class DigGame extends AGame {
        private _timer;
        private _progress;
        private _attack;
        private _garbage;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width?: number, bagSize?: number, pieces?: Piece[], delay?: number, repeat?: number);
        resetGame(seed?: number): void;
        protected tick(): void;
        private win;
        protected lock(): void;
        private addGarbage;
        private checkGarbageShift;
    }
}
declare namespace ASC {
    class Game extends AGame {
        private _timer;
        private _progress;
        private _attack;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width?: number, bagSize?: number, pieces?: Piece[], delay?: number, repeat?: number);
        resetGame(seed?: number): void;
        protected lock(): void;
    }
}
declare namespace ASC {
    class MapGame extends AGame {
        private _map;
        private _solid;
        private _progress;
        private _attack;
        private _order;
        private _timer;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width?: number, bagSize?: number, pieces?: Piece[], order?: number[], clearable?: number[], unclearable?: number[], delay?: number, repeat?: number);
        resetGame(seed?: number): void;
        protected lock(): void;
    }
}
declare namespace M {
    class MapEditor {
        private _mapDiv;
        private _mapTable;
        private _blocks;
        private _width;
        private _lefts;
        private _widthText;
        private _widthSlider;
        private _pieceEditor;
        private _queueInput;
        constructor();
        getDiv(): HTMLDivElement;
        private genMap;
        private widthInput;
        private drawTable;
    }
    function init(): void;
}
declare namespace NAV {
    function init(): void;
}
declare namespace B {
    function fromNumber(num: number): string;
    function toNumber(s: string): number;
    function binaryTo64(n: string): string;
    function binaryFrom64(n: string): string;
    function hexTo64(n: string): string;
    function hexFrom64(n: string): string;
    function pad(toPad: string, padChar: string, padnum: number): string;
}
declare namespace STYLE {
    function init(): void;
}
declare namespace C {
    class Checkbox {
        private static _lastState;
        private _checked;
        private _disabled;
        private _td;
        constructor(size?: number);
        getTD(): HTMLTableDataCellElement;
        private update;
        private click;
        private move;
        checked: boolean;
        disabled: boolean;
    }
}
declare namespace H {
    class Title {
    }
}
