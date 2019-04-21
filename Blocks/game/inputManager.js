var ASC;
(function (ASC) {
    let Keys;
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
    class Key {
        constructor(code, delay = 100, rate = 20) {
            this._pressed = false;
            this._listeners = [];
            this._code = code;
            this._delay = delay;
            this._rate = rate;
        }
        onPress() {
            this._pressed = true;
            this._timeout = window.setTimeout(this.activate.bind(this), this._delay);
        }
        activate() {
            this._interval = window.setInterval(this.repeat.bind(this), this._rate);
        }
        repeat() {
            for (let l of this._listeners) {
                l.Triggered(this._code);
            }
        }
        onRelease() {
            this._pressed = false;
            clearTimeout(this._timeout);
            clearInterval(this._interval);
            //console.log("Cleared: " + this._code);
        }
        registerTrigger(t) {
            this._listeners.push(t);
        }
        get code() {
            return this._code;
        }
    }
    class InputManager {
        constructor() { }
        static setFocus(f) {
            InputManager._focus = f;
        }
        static initialize() {
            for (let i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        }
        static onKeyDown(event) {
            if (InputManager._focus) {
                if (InputManager._keyCodes[event.keyCode] !== true) {
                    InputManager.NotifyObservers(event.keyCode);
                    InputManager._keyCodes[event.keyCode] = true;
                    if (InputManager._keys.length > 0) {
                        for (let k of InputManager._keys) {
                            if (k.code === event.keyCode) {
                                k.onPress();
                            }
                        }
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
            return false;
        }
        static onKeyUp(event) {
            if (InputManager._focus) {
                InputManager._keyCodes[event.keyCode] = false;
                if (InputManager._keys.length > 0) {
                    for (let k of InputManager._keys) {
                        if (k.code === event.keyCode) {
                            k.onRelease();
                        }
                    }
                }
                event.preventDefault();
                event.stopPropagation();
            }
            return false;
        }
        static RegisterKeys(Observer, keyCodes, delay, repeat) {
            for (let i of keyCodes) {
                InputManager._keys.push(new Key(i, delay, repeat));
                InputManager._keys[InputManager._keys.length - 1].registerTrigger(Observer);
            }
        }
        static RegisterObserver(Observer) {
            InputManager._observers.push(Observer);
        }
        static UnregisterObserver(Observer) {
            let index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1);
            }
            else {
                console.warn("Cannot unregister observer.");
            }
        }
        static NotifyObservers(keyevent) {
            for (let o of InputManager._observers) {
                o.Triggered(keyevent);
            }
        }
        static cancelRepeat(keycode) {
            if (InputManager._keys.length > 0) {
                for (let k of InputManager._keys) {
                    if (k.code === keycode) {
                        k.onRelease();
                    }
                }
            }
        }
    }
    InputManager._keys = [];
    InputManager._keyCodes = [];
    InputManager._observers = [];
    InputManager._focus = true;
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
