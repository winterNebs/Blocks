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
