/// <reference path="iqueue.ts" />
namespace ASC {
    export class Queue extends IQueue {
        private _bag: Piece[];      //Bag for randomization
        private _bagSize: number;   //Size of memory (0 for memoryless)
        private _queue: Piece[] = [];
        private _rng: PRNG;

        public constructor(seed: number, pieces: Piece[], size: number = pieces.length) {
            super();
            this._rng = new PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        private generateQueue(): void {
            if (this._queue.length < this._bagSize) {
                let tempBag = [];
                while (tempBag.length < this._bagSize) {
                    this._bag.forEach((i) => tempBag.push(i.getCopy()));
                }
                this._rng.shuffleArray(tempBag);
                for (let i of tempBag.splice(0, this._bagSize)) {
                    this._queue.push(i);
                }
            }
        }
        public getQueue(): Piece[] {
            return this._queue.slice(0, NUM_PREVIEWS);//need to copy 
        }
        public getNext(): Piece {
            let temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        }
    }
}