export declare class PRNG {
    private _seed;
    constructor(seed: number);
    /**
     * Returns a pseudo-random value between 1 and 2^32 - 2.
     */
    next(): number;
    /**
     * Returns a pseudo-random floating point number in range [0, 1).
     */
    nextFloat(): number;
    shuffleArray(array: any): void;
}
