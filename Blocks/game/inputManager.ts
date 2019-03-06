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


    export class InputManager {
        private static _keys: boolean[] = [];
        private static _observers: IInputObserver[] = [];
        private constructor() { }

        public static initialize(): void {
            for (let i = 0; i < 255; ++i) {
                InputManager._keys[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        }

        public static isKeyDown(key: Keys): boolean {
            return InputManager._keys[key];
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
            InputManager._keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();

            InputManager.NotifyObservers(event, true);

            return false;
        }
        private static onKeyUp(event: KeyboardEvent): boolean {
            InputManager._keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            InputManager.NotifyObservers(event, false);
            return false;
        }

        public static RegisterObserver(Observer: IInputObserver): void {
            InputManager._observers.push(Observer);
        }
        public static UnregisterObserver(Observer: IInputObserver): void {
            let index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1)
            }
            else {
                console.warn("Cannot unregister observer.")
            }
        }
        private static NotifyObservers(keyevent: KeyboardEvent, down: boolean) {
            for (let o of InputManager._observers) {
                o.RecieveNotification(keyevent, down);
            }
        }


    }
}