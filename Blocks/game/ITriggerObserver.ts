namespace ASC {

    export interface ITriggerObserver {
        Triggered(keyCode:number): void;
    }
}