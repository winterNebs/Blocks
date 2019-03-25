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
    var Renderer = /** @class */ (function (_super) {
        __extends(Renderer, _super);
        function Renderer(width, queueSize) {
            var _this = _super.call(this) || this;
            _this._queue = [];
            _this._field = new ASC.RenderGrid(width, ASC.FIELD_HEIGHT, 24, 10 * 5);
            _this.addChild(_this._field);
            for (var i = 0; i < queueSize; ++i) {
                _this._queue.push(new ASC.RenderGrid(5, 5, 10, width * 24 + 10 * 5, 10 * 5 * i));
                _this.addChild(_this._queue[i]);
            }
            _this._hold = new ASC.RenderGrid(5, 5, 10);
            _this.addChild(_this._hold);
            return _this;
        }
        Renderer.prototype.updateField = function (Field) {
            this._field.updateGrid(Field);
        };
        Renderer.prototype.updateQueue = function (q) {
            for (var i = 0; i < q.length; ++i) {
                console.log(q[i]);
                this._queue[i].updateGrid(q[i]);
            }
        };
        Renderer.prototype.updateHold = function (p) {
            this._hold.updateGrid(p);
        };
        return Renderer;
    }(PIXI.Container));
    ASC.Renderer = Renderer;
})(ASC || (ASC = {}));
//# sourceMappingURL=renderer.js.map