namespace ASC {

    export interface IInputObserver {
        RecieveNotification(keyevent: KeyboardEvent, down: boolean): void;
    }
}