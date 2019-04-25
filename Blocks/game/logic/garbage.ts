namespace ASC {
    export class Garbage extends AGarbage {
        private _width: number;
        private _percentage: number;

        // So garbage reduction is proportional to the number of holes
        // Reduction = % of holes:
        // attakc inverse % of holes
        public constructor(width: number, percentage:number) {
            super();
            this._width = width;
            if (percentage >= 0 && percentage < 100) {
                this._percentage = percentage;
            }
            else {
                throw new Error("Invalid Percentage: " + percentage);
            }
        }
        public addGarbage(attack: number): number[] {
            return [];
        }
    }
}