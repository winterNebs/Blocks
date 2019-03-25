var ASC;
(function (ASC) {
    //Representation of a block.
    var Block = /** @class */ (function () {
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
        function Block(color, solid, clearable) {
            if (color === void 0) { color = 0x000000; }
            if (solid === void 0) { solid = false; }
            if (clearable === void 0) { clearable = false; }
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        Object.defineProperty(Block.prototype, "color", {
            get: function () {
                return this._color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "solid", {
            get: function () {
                return this._solid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "clearable", {
            get: function () {
                return this._clearable;
            },
            enumerable: true,
            configurable: true
        });
        return Block;
    }());
    ASC.Block = Block;
})(ASC || (ASC = {}));
//# sourceMappingURL=block.js.map