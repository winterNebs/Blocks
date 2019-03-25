var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ASC;
(function (ASC) {
    var RenderGrid = /** @class */ (function (_super) {
        __extends(RenderGrid, _super);
        function RenderGrid(width, height, size, x, y) {
            if (size === void 0) { size = 24; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this) || this;
            _this._width = width;
            _this._height = height;
            _this._size = size;
            _this._x = x;
            _this._y = y;
            _this._texture = PIXI.loader.resources["assets/textures/b.png"].texture;
            _this.initalizeSprites();
            return _this;
        }
        RenderGrid.prototype.initalizeSprites = function () {
            this._sprites = [];
            for (var i = 0; i < this._width * this._height; ++i) {
                var s = new PIXI.Sprite(this._texture);
                s.height = this._size;
                s.width = this._size;
                s.x = i % this._width * this._size + this._x;
                s.y = ~~(i / this._width) * this._size + this._y;
                s.tint = 0x000000;
                //tint
                this.addChild(s);
                this._sprites.push(s);
            }
        };
        //Color is hex
        RenderGrid.prototype.updateColor = function (index, color) {
            //if (this._sprites[index].tint != color) {
            this._sprites[index].tint = color;
            //}
        };
        RenderGrid.prototype.updateGrid = function (Field) {
            for (var i = 0; i < Field.length; ++i) {
                this.updateColor(i, Field[i]);
            }
        };
        return RenderGrid;
    }(PIXI.Container));
    ASC.RenderGrid = RenderGrid;
})(ASC || (ASC = {}));
//# sourceMappingURL=renderGrid.js.map