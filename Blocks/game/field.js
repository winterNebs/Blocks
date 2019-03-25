var ASC;
(function (ASC) {
    //Representation of a game field.
    var Field = /** @class */ (function () {
        /**
         * Creates a new game feild
         * @param width Width of the gamefield.
         */
        function Field(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        //Initialzes the field with empty blocks.
        Field.prototype.initialize = function () {
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        Field.prototype.shift = function (lines) {
            this._array.splice(0, lines * this._width);
            for (var i = 0; i < lines * this._width; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        /**
         * Returns the block at the 1D index.
         * @param index Index of the block to be returned.
         */
        Field.prototype.getAt = function (index) {
            return this._array[index];
        };
        Field.prototype.getColors = function () {
            var c = [];
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var i = _a[_i];
                c.push(i.color);
            }
            return c;
        };
        /**
         * Sets specified indices to a certain block.
         * @param indices Indices to be replaced.
         * @param block Type of block to replace with.
         */
        Field.prototype.setBlocks = function (indices, block) {
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var i = indices_1[_i];
                this._array[i] = block;
            }
        };
        /**
         * Clear the line at the specified y-value.
         * @param yval Row to be removed.
         */
        Field.prototype.clearLineAt = function (yval) {
            this._array.splice(yval * this._width, this._width);
            for (var i = 0; i < this._width; ++i) {
                this._array.unshift(new ASC.Block());
            }
        };
        return Field;
    }());
    ASC.Field = Field;
})(ASC || (ASC = {}));
//# sourceMappingURL=field.js.map