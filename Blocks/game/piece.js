var ASC;
(function (ASC) {
    var Piece = /** @class */ (function () {
        function Piece(name, shape, offset, initOrient, color) {
            if (offset === void 0) { offset = 0; }
            if (initOrient === void 0) { initOrient = 0; }
            if (color === void 0) { color = 0xFFFFFF; }
            this._shape = []; //The shape of piece (array of indecies to be filled)
            this._orientations = []; //Precomputed orientations/rotations
            this._currentOrientation = 0; //Current orientation
            this._x = 0;
            this._y = 0;
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this.reset();
        }
        Piece.prototype.initRotations = function () {
            this._orientations.push(this._shape);
            var temp = [];
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                temp.push(20 - 5 * (i % 5) + ~~(i / 5));
            }
            this._orientations.push(temp);
            temp = [];
            for (var _b = 0, _c = this._shape; _b < _c.length; _b++) {
                var i = _c[_b];
                temp.push(24 - i);
            }
            this._orientations.push(temp);
            temp = [];
            for (var _d = 0, _e = this._shape; _d < _e.length; _d++) {
                var i = _e[_d];
                temp.push(4 + 5 * (i % 5) - ~~(i / 5));
            }
            this._orientations.push(temp);
        };
        Piece.prototype.setShape = function (shape) {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            this._blockCount = shape.length;
            for (var _i = 0, shape_1 = shape; _i < shape_1.length; _i++) {
                var i = shape_1[_i];
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._blockCount = shape.length;
            this._shape = shape;
            this._orientations.push(shape);
            var cw = [];
            var ccw = [];
            var cwcw = [];
            for (var _a = 0, shape_2 = shape; _a < shape_2.length; _a++) {
                var i = shape_2[_a];
                cw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                ccw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        };
        Piece.prototype.rotate = function (dir) {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
        };
        Piece.prototype.move = function (x, y) {
            this._x += x;
            this._y += y;
        };
        Piece.prototype.getCoords = function (width) {
            var c = [];
            for (var _i = 0, _a = this._orientations[this._currentOrientation]; _i < _a.length; _i++) {
                var i = _a[_i];
                var newI = (i % 5) + ~~(i / 5) * width;
                c.push(newI + this._x + this._y * width);
            }
            return c;
        };
        Piece.prototype.getYVals = function () {
            var c = [];
            for (var _i = 0, _a = this._orientations[this._currentOrientation]; _i < _a.length; _i++) {
                var i = _a[_i];
                var y = ~~(i / 5) + this._y;
                c.push(y);
            }
            return c;
        };
        Piece.prototype.reset = function () {
            this._currentOrientation = this._initialOrientation;
            this._x = this._offset;
            this._y = 0;
        };
        Piece.prototype.getCopy = function () {
            var copy = new Piece(this._name, this._shape, this._offset, this._initialOrientation, this._color);
            copy._orientations = this._orientations;
            copy._x = this._x;
            copy._y = this._y;
            copy._currentOrientation = this._currentOrientation;
            return copy;
        };
        Piece.prototype.getRenderShape = function () {
            var temp = [];
            for (var i = 0; i < 25; ++i) {
                temp.push(0x000000);
            }
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                temp[i] = 0xFFFFFF;
            }
            return temp;
        };
        Object.defineProperty(Piece.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Piece;
    }());
    ASC.Piece = Piece;
})(ASC || (ASC = {}));
//# sourceMappingURL=piece.js.map