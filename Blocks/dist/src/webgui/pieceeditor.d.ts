import { Piece } from "../game/logic/piece";
export declare class PieceEditor {
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
    constructor(width?: number, pieces?: Piece[]);
    private removePieceClick;
    private addPieceClick;
    private offsetUpdate;
    private updateList;
    private displayPiece;
    private cth;
    getDiv(): HTMLDivElement;
    setWidth(width: number): void;
    getPieces(): Piece[];
    disable(state: boolean): void;
    setPieces(p: Piece[]): void;
}
