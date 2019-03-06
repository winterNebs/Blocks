namespace ASC {
    export const NUM_PREVIEWS = 6;
    export class Queue {
        private _bag: Piece[];      //Bag for randomization
        private _bagSize: number;   //Size of memory (0 for memoryless)
        private _queue: Piece[] = [];
        private _rng: PRNG;

        public constructor(seed: number, pieces: Piece[], size: number = pieces.length) {
            this._rng = new PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        private generateQueue(): void {
            let tempBag = this._bag.slice(0);
            while (tempBag.length < this._bagSize ) {
                tempBag.concat(this._bag.slice(0));
            }
            while (this._queue.length < NUM_PREVIEWS) {
                this._rng.shuffleArray(tempBag)
                Array.prototype.push.apply(this._queue, tempBag.slice(0, this._bagSize));
            }
        }
        public getBag(): Piece[] {
            return this._queue.slice(0, NUM_PREVIEWS);;
        }
        public getNext(): Piece {
            let temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        }
    }
}