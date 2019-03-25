var ASC;
(function (ASC) {
    var Keys;
    (function (Keys) {
        Keys[Keys["LEFT"] = 37] = "LEFT";
        Keys[Keys["UP"] = 38] = "UP";
        Keys[Keys["RIGHT"] = 39] = "RIGHT";
        Keys[Keys["DOWN"] = 40] = "DOWN";
        Keys[Keys["S"] = 83] = "S";
        Keys[Keys["D"] = 68] = "D";
        Keys[Keys["SPACE"] = 32] = "SPACE";
        Keys[Keys["SHIFT"] = 16] = "SHIFT";
    })(Keys = ASC.Keys || (ASC.Keys = {}));
    var Key = /** @class */ (function () {
        function Key(code, delay, rate) {
            if (delay === void 0) { delay = 100; }
            if (rate === void 0) { rate = 20; }
            this._pressed = false;
            this._listeners = [];
            this._code = code;
            this._delay = delay;
            this._rate = rate;
        }
        Key.prototype.onPress = function () {
            this._pressed = true;
            //this._timeStart = Date.now();
            this._timeout = setTimeout(this.activate.bind(this), this._delay);
        };
        Key.prototype.activate = function () {
            //let delta = Date.now() - this._timeStart; // milliseconds elapsed since start
            this._interval = setInterval(this.repeat.bind(this), this._rate);
            //console.log("activate: " + this._code);
        };
        Key.prototype.repeat = function () {
            //console.log("triggered: " + this._code);
            for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
                var l = _a[_i];
                //console.log(l);
                l.Triggered(this._code);
            }
        };
        Key.prototype.onRelease = function () {
            this._pressed = false;
            clearTimeout(this._timeout);
            clearInterval(this._interval);
            //console.log("Cleared: " + this._code);
        };
        Key.prototype.registerTrigger = function (t) {
            this._listeners.push(t);
        };
        Object.defineProperty(Key.prototype, "code", {
            get: function () {
                return this._code;
            },
            enumerable: true,
            configurable: true
        });
        return Key;
    }());
    var InputManager = /** @class */ (function () {
        function InputManager() {
        }
        InputManager.initialize = function () {
            for (var i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        };
        InputManager.onKeyDown = function (event) {
            if (InputManager._keyCodes[event.keyCode] !== true) {
                InputManager.NotifyObservers(event.keyCode);
                InputManager._keyCodes[event.keyCode] = true;
                if (InputManager._keys.length > 0) {
                    for (var _i = 0, _a = InputManager._keys; _i < _a.length; _i++) {
                        var k = _a[_i];
                        if (k.code === event.keyCode) {
                            k.onPress();
                        }
                    }
                }
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        InputManager.onKeyUp = function (event) {
            InputManager._keyCodes[event.keyCode] = false;
            if (InputManager._keys.length > 0) {
                for (var _i = 0, _a = InputManager._keys; _i < _a.length; _i++) {
                    var k = _a[_i];
                    if (k.code === event.keyCode) {
                        k.onRelease();
                    }
                }
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
        InputManager.RegisterKeys = function (Observer, keyCodes, delay, repeat) {
            for (var _i = 0, keyCodes_1 = keyCodes; _i < keyCodes_1.length; _i++) {
                var i = keyCodes_1[_i];
                InputManager._keys.push(new Key(i, delay, repeat));
                InputManager._keys[InputManager._keys.length - 1].registerTrigger(Observer);
            }
        };
        InputManager.RegisterObserver = function (Observer) {
            InputManager._observers.push(Observer);
        };
        InputManager.UnregisterObserver = function (Observer) {
            var index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1);
            }
            else {
                console.warn("Cannot unregister observer.");
            }
        };
        InputManager.NotifyObservers = function (keyevent) {
            for (var _i = 0, _a = InputManager._observers; _i < _a.length; _i++) {
                var o = _a[_i];
                o.Triggered(keyevent);
            }
        };
        InputManager._keys = [];
        InputManager._keyCodes = [];
        InputManager._observers = [];
        return InputManager;
    }());
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
//# sourceMappingURL=inputManager.js.map