var ASC;
(function (ASC) {
    //Representation of a game field.
    class Field {
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        constructor(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        //Initialzes the field with empty blocks.
        initialize() {
            for (let i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                this._array.push(new ASC.Block());
            }
        }
        shift(lines) {
            this._array.splice(0, lines * this._width);
            for (let i = 0; i < lines * this._width; ++i) {
                this._array.push(new ASC.Block());
            }
        }
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        getAt(index) {
            return this._array[index];
        }
        getColors() {
            let c = [];
            for (let i of this._array) {
                c.push(i.color);
            }
            return c;
        }
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        setBlocks(indices, block) {
            for (let i of indices) {
                this._array[i] = block;
            }
        }
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        clearLineAt(yval) {
            this._array.splice(yval * this._width, this._width);
            for (let i = 0; i < this._width; ++i) {
                this._array.unshift(new ASC.Block());
            }
        }
    }
    ASC.Field = Field;
})(ASC || (ASC = {}));
