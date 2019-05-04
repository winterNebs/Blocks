import { AQueue } from "./Aqueue";
import { Piece } from "../piece";
export declare class StaticQueue extends AQueue {
    private _bag;
    private _queue;
    constructor(pieces: Piece[], order: number[]);
    getQueue(): Piece[];
    getNext(): Piece;
    hasNext(): boolean;
    blocksLeft(): number;
}
