import { Piece } from "../piece";
export declare const NUM_PREVIEWS = 6;
export declare abstract class AQueue {
    abstract getQueue(): Piece[];
    abstract getNext(): Piece;
    abstract hasNext(): boolean;
}
