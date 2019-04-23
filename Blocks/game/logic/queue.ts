/// <reference path="iqueue.ts" />
namespace ASC {
    export class Queue extends IQueue {
        private _bag: Piece[];      //Bag for randomization
        private _bagSize: number;   //Size of memory (1 for memoryless)
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
            //Less pieces then previews
            //Add enoguh pieces until it's full
            while (this._queue.length < NUM_PREVIEWS) {
                let tempBag = [];
                //Make sure enough pieces for larger bag size than pieces
                while (tempBag.length < this._bagSize) {
                    this._bag.forEach((i) => tempBag.push(i.getCopy())); // Fill it with a copy
                }
                this._rng.shuffleArray(tempBag);
                for (let i of tempBag.slice(0, this._bagSize + 1)) {
                    this._queue.push(i);
                }
            }


            //Take the number of pieces for bag size
        }
        public getQueue(): Piece[] {
            return this._queue.slice(0, NUM_PREVIEWS);//need to copy 
        }
        public getNext(): Piece {
            let temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        }
        public hasNext(): boolean {
            return true;
        }
    }
}