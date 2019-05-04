import { Piece } from "../logic/piece";
export declare class Config {
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
    pieces: Piece[];
    controls: number[];
    delay: number;
    repeat: number;
    bagSize: number;
}
