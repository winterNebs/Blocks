/// <reference path="Aqueue.d.ts" />
declare namespace ASC {
    class StaticQueue extends AQueue {
        private _bag;
        private _queue;
        constructor(pieces: Piece[], order: number[]);
        getQueue(): Piece[];
        getNext(): Piece;
        hasNext(): boolean;
        blocksLeft(): number;
    }
}
