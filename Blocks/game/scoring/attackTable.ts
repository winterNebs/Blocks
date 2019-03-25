namespace ASC {
    const CLEAR: number = -1; //Lines cleared -1
    const SPIN: number = 2;
    const PC: number = 6
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
            return num + CLEAR;
        }
        public spin(num: number): number {
            return num * SPIN;
        }
        public perfectClear(num: number): number {
            return PC;
        }
    }

}