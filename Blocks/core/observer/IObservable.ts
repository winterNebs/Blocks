namespace TSE {

    export interface IObservable {
        RegisterObserver(Observer: IObserver): void;
        UnregisterObserver(Observer: IObserver): void;
        NotifyObservers();

    }
}