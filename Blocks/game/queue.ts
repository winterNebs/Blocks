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
            if (this._queue.length < this._bagSize) {
                let tempBag = [];
                while (tempBag.length < this._bagSize) {
                   this._bag.forEach((i) => tempBag.push(i.getCopy()));
                }
                for (let i of tempBag) {
                    this._queue.push(i);
                }
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