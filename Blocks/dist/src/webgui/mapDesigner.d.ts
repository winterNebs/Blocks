export declare class MapEditor {
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
export declare function init(): void;
