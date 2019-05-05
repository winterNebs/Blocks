import { AGame } from "./Agame";
import { Piece } from "../logic/piece";
export declare class MapGame extends AGame {
    private _map;
    private _solid;
    private _attack;
    private _order;
    private _timer;
    /**
     * Creates a new game
     * @param width Width of the game feild, (5 < width < 20, Default: 12).
     */
    constructor(width?: number, bagSize?: number, pieces?: Piece[], order?: number[], clearable?: number[], unclearable?: number[]);
    resetGame(seed?: number): void;
    protected lock(): void;
}
