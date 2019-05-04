declare namespace ASC {
    class Stopwatch {
        private _start;
        private _active;
        private _elapsed;
        constructor();
        start(): void;
        stop(): void;
        resume(): void;
        getTime(): number;
    }
}
