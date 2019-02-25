namespace TSE {

    export enum Keys {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }


    export class InputManager implements IObservable{
        private static _keys: boolean[] = [];
        private static _observers: IObserver[] = [];
        private constructor() { }

        public static initialize(): void {
            for (let i = 0; i < 255; ++i) {
                InputManager._keys[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        }

        public static isKeyDown(key:Keys): boolean {
            return InputManager._keys[key];
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
            InputManager._keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        private static onKeyUp(event: KeyboardEvent): boolean {
            InputManager._keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        public RegisterObserver(Observer: IObserver): void {
            InputManager._observers.push(Observer);
        }
        public UnregisterObserver(Observer: IObserver): void {
            let index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1)
            }
            else {
                console.warn("Cannot unregister observer.")
            }
        }
        public NotifyObservers() {
            for (let o of InputManager._observers) {
                o.RecieveNotification("Keypresed");
            }
        }

        
    }
}