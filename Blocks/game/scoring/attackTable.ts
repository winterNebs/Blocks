namespace ASC {
    const CLEAR: number = -1; //Lines cleared -1
    const SPIN: number = 2;
    const PC: number = 6;
    //Multipliers for field width/ complexity / diversity
    //MINI
    //Combo
    //Perfect clear
    export class AttackTable {
        private _width: number; // use later
        public constructor(width: number) {
            this._width = width;
        }
        public clear(num: number): number {
            return this.widthMultiplier(num + CLEAR);
        }
        public spin(num: number): number {
            return this.widthMultiplier(num * SPIN);
        }
        public perfectClear(num: number): number {
            return this.widthMultiplier(PC);
        }
        private widthMultiplier(num: number): number {
            return num + ~~(num * (this._width - 10) / 4);
        }
    }

}