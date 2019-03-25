namespace ASC {

    export enum Keys {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        S = 83,
        D = 68,
        SPACE = 32,
        SHIFT = 16
    }

    class Key {
        private _code: number;
        private _pressed: boolean = false;
        private _delay: number;
        private _rate: number;
        //private _timeStart: number = 0;
        private _timeout: number;
        private _interval: number;
        private _listeners: ITriggerObserver[] = [];


        public constructor(code: number, delay: number = 100, rate: number = 20) {
            this._code = code;
            this._delay = delay;
            this._rate = rate;
        }
        public onPress(): void {
            this._pressed = true;
            this._timeout = setTimeout(this.activate.bind(this), this._delay);
        }
        private activate(): void {
            this._interval = setInterval(this.repeat.bind(this), this._rate);
        }
        private repeat(): void {
            for (let l of this._listeners) {
                l.Triggered(this._code);
            }
        }
        public onRelease(): void {
            this._pressed = false;
            clearTimeout(this._timeout);
            clearInterval(this._interval);
            //console.log("Cleared: " + this._code);
        }
        public registerTrigger(t: ITriggerObserver): void {
            this._listeners.push(t);
        }
        public get code(): number {
            return this._code;
        }
    }

    export class InputManager {
        private static _keys: Key[] = [];
        private static _keyCodes: boolean[] = [];
        private static _observers: ITriggerObserver[] = [];
        private constructor() { }

        public static initialize(): void {
            for (let i = 0; i < 255; ++i) {
                InputManager._keyCodes[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
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


            return false;
        }
        private static onKeyUp(event: KeyboardEvent): boolean {
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
            return false;
        }
        public static RegisterKeys(Observer: ITriggerObserver, keyCodes: number[], delay: number, repeat: number) {
            for (let i of keyCodes) {
                InputManager._keys.push(new Key(i, delay, repeat));
                InputManager._keys[InputManager._keys.length - 1].registerTrigger(Observer);
            }
        }
        public static RegisterObserver(Observer: ITriggerObserver): void {
            InputManager._observers.push(Observer);
        }
        public static UnregisterObserver(Observer: ITriggerObserver): void {
            let index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1)
            }
            else {
                console.warn("Cannot unregister observer.")
            }
        }
        private static NotifyObservers(keyevent: number) {
            for (let o of InputManager._observers) {
                o.Triggered(keyevent);
            }
        }


    }
}