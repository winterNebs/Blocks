/// <reference path="dragutil.d.ts" />
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
