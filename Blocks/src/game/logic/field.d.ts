declare namespace ASC {
    class Field {
        private _width;
        private _array;
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        constructor(width: number);
        private initialize;
        private shift;
        appendRow(row: Block[], yval: number): void;
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        getAt(index: number): Block;
        getColors(): number[];
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        setBlocks(indices: number[], block: Block): void;
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        clearLineAt(yval: number): void;
    }
}
