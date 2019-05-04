import { Piece } from "../piece";
import { AQueue } from "./Aqueue";
export declare class Queue extends AQueue {
    private _bag;
    private _bagSize;
    private _queue;
    private _rng;
    constructor(seed: number, pieces: Piece[], size?: number);
    private generateQueue;
    getQueue(): Piece[];
    getNext(): Piece;
    hasNext(): boolean;
}
