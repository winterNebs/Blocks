namespace ASC {
    export const NUM_PREVIEWS = 6;
    export class Queue {
        private _bag: Piece[];      //Bag for randomization
        private _bagSize: number;   //Size of memory (0 for memoryless)
        private _queue: Piece[];
        private _rng: PRNG;

        public constructor(seed: number, size: number) {
            this._rng = new PRNG(seed);
            this._bagSize = size;
        }
        public setPieces(pieces: Piece[]): void {
            this._bag = pieces;
        }
        public generateQueue(): void {
            let tempBag = this._bag.slice(0);
            while (this._bagSize > tempBag.length) {
                tempBag.concat(this._bag.slice(0));
            }
            while (this._queue.length < NUM_PREVIEWS) {
                this._rng.shuffleArray(tempBag)
                this._queue.concat(tempBag.slice(0, this._bagSize));
            }
        }
        public getBag(): Piece[] {
            return this._queue.slice(0, NUM_PREVIEWS);
        }
        public getNext(): Piece {
            return this._queue.splice(0, 1)[0];
        }
    }
}