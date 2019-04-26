namespace ASC {
    export class Garbage extends AGarbage {
        private _width: number;
        private _percentage: number;
        private _prng: PRNG;
        // So garbage reduction is proportional to the number of holes
        // Reduction = % of holes:
        // attakc inverse % of holes
        public constructor(seed:number, width: number, percentage:number) {
            super();
            this._prng = new PRNG(seed);
            this._width = width;
            if (percentage >= 0 && percentage < 100) {
                this._percentage = percentage;
            }
            else {
                throw new Error("Invalid Percentage: " + percentage);
            }
        }
        public addGarbage(attack: number): number[][] {
            let g: number[][] = [];
            let a: number[] = [];
            for (let i = 0; i < this._width; ++i) {
                
                if (i < this._percentage * this._width) {
                    a.push(1);
                }
                else {
                    a.push(0);
                }
            }
            this._prng.shuffleArray(a);
            for (let i = 0; i < attack *this._percentage +0.1; ++i) {
                g.push(a);
            }
            console.log(g);
            return g;
        }
    }
}