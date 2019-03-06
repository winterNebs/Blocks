namespace ASC {
    export class PRNG {
        private _seed: number; //Seed must be integer;
        public constructor(seed: number) {
            this._seed = seed % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }

        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        public next(): number {
            return this._seed = this._seed * 16807 % 2147483647;
        }
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        public nextFloat(): number {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return (this.next() - 1) / 2147483646;
        }
        public shuffleArray(array): void {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(this.nextFloat() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    }
}