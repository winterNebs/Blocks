declare namespace ASC {
    class AttackTable {
        private _width;
        constructor(width: number);
        clear(num: number): number;
        spin(num: number): number;
        perfectClear(num: number): number;
        private widthMultiplier;
    }
}
