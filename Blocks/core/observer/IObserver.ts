namespace TSE {

    export interface IObserver {
        RecieveNotification<T>(Message: T): void;
    }
}