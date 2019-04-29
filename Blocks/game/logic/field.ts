namespace ASC {
    //Representation of a game field.
    export class Field {
        private _width: number;
        private _array: Block[] = [];
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        public constructor(width: number) {
            this._width = width;
            this.initialize();
        }

        //Initialzes the field with empty blocks.
        private initialize(): void {
            for (let i = 0; i < this._width * FIELD_HEIGHT; ++i) {
                this._array.push(new Block());
            }
        }


        private shift(lines: number): void { // take garbage or something; nah
            this._array.splice(0, lines * this._width);
            for (let i = 0; i < lines * this._width; ++i) {
                this._array.push(new Block());
            }
        }

        public appendRow(row: Block[], yval: number) {
            //this._array.splice.apply(this._width * yval, ...row);
            //this._array.splice(0, row.length);
            let end = this._array.splice(yval * this._width);
            let temp = this._array.concat(row).concat(end);
            temp.splice(0,row.length);
            this._array = temp;
        }
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        public getAt(index: number): Block {
            return this._array[index];
        }

        public getColors(): number[] {
            let c: number[] = [];
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
        public setBlocks(indices: number[], block: Block): void {
            for (let i of indices) {
                this._array[i] = block;
            }
        }
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        public clearLineAt(yval: number): void {
            this._array.splice(yval * this._width, this._width);
            for (let i = 0; i < this._width; ++i) {
                this._array.unshift(new Block());
            }
        }
    }
}