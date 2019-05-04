import { Piece } from "../logic/piece";

export class MapData {

    private _clearable: number[] = [];
    private _width: number = 10;
    private _unclearable: number[] = [];
    private _queue: number[] = [];
    private _pieces: Piece[] = [];
    public constructor(w: number, p: Piece[], q: number[], c: number[], u: number[]) {
        this._width = w;
        this._pieces = p;
        this._queue = q;
        this._clearable = c;
        this._unclearable
    }
    public get width(): number {
        return this._width;
    }
    public get clearable(): number[] {
        return [...this._clearable]
    }
    public get unclearable(): number[] {
        return [...this._unclearable]
    }
    public get queue(): number[] {
        return [...this._queue]
    }
    public get pieces(): Piece[] {
        return [...this._pieces].map(p => p.getCopy());
    }
}

