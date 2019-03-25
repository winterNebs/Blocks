var ASC;
(function (ASC) {
    ASC.NUM_PREVIEWS = 6;
    var Queue = /** @class */ (function () {
        function Queue(seed, pieces, size) {
            if (size === void 0) { size = pieces.length; }
            this._queue = [];
            this._rng = new ASC.PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        Queue.prototype.generateQueue = function () {
            if (this._queue.length < this._bagSize) {
                var tempBag_2 = [];
                while (tempBag_2.length < this._bagSize) {
                    this._bag.forEach(function (i) { return tempBag_2.push(i.getCopy()); });
                }
                this._rng.shuffleArray(tempBag_2);
                for (var _i = 0, tempBag_1 = tempBag_2; _i < tempBag_1.length; _i++) {
                    var i = tempBag_1[_i];
                    this._queue.push(i);
                }
            }
        };
        Queue.prototype.getQueue = function () {
            return this._queue.slice(0, ASC.NUM_PREVIEWS); //need to copy 
        };
        Queue.prototype.getNext = function () {
            var temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        };
        return Queue;
    }());
    ASC.Queue = Queue;
})(ASC || (ASC = {}));
//# sourceMappingURL=queue.js.map