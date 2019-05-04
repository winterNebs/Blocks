import { ITriggerObserver } from "./ITriggerObserver";
export declare enum Keys {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    S = 83,
    D = 68,
    SPACE = 32,
    SHIFT = 16
}
export declare class InputManager {
    private static _keys;
    private static _keyCodes;
    private static _observers;
    private constructor();
    private static _focus;
    static setFocus(f: boolean): void;
    static initialize(): void;
    private static onKeyDown;
    private static onKeyUp;
    static RegisterKeys(Observer: ITriggerObserver, keyCodes: number[], delay: number, repeat: number): void;
    static RegisterObserver(Observer: ITriggerObserver): void;
    static UnregisterObserver(Observer: ITriggerObserver): void;
    private static NotifyObservers;
    static cancelRepeat(keycode: number): void;
}
