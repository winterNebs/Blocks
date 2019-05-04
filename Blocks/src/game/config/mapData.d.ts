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
