declare namespace ASC {
    class Garbage extends AGarbage {
        private _width;
        private _percentage;
        private _prng;
        constructor(seed: number, width: number, percentage: number);
        addGarbage(attack: number): number[][];
    }
}
