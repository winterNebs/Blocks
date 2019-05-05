export interface ITriggerObserver {
    Triggered(keyCode: number, repeat: boolean): void;
}
