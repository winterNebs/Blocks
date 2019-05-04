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
