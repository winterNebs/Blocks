var ASC;
(function (ASC) {
    var PRNG = /** @class */ (function () {
        function PRNG(seed) {
            this._seed = Math.round(seed) % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        PRNG.prototype.next = function () {
            return this._seed = this._seed * 16807 % 2147483647;
        };
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        PRNG.prototype.nextFloat = function () {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return (this.next() - 1) / 2147483646;
        };
        PRNG.prototype.shuffleArray = function (array) {
            var _a;
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(this.nextFloat() * (i + 1));
                _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
            }
        };
        return PRNG;
    }());
    ASC.PRNG = PRNG;
})(ASC || (ASC = {}));
//# sourceMappingURL=prng.js.map