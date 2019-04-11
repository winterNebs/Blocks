/// <reference path="iqueue.ts" />
namespace ASC {
    export class StaticQueue extends IQueue {
        private _bag: Piece[];      //Static bag for reference
        private _queue: Piece[] = []; //Numbers for which piece

        public constructor(pieces: Piece[], order: number[]) {
            super();
            this._bag = pieces;
            for (let i of order) {
                this._queue.push(this._bag[i].getCopy());
            }
        }
        public getQueue(): Piece[] {
            return this._queue.slice(0, NUM_PREVIEWS);//need to copy 
        }
        public getNext(): Piece {
            let temp = this._queue.splice(0, 1)[0];
            return temp;
        }
    }
}