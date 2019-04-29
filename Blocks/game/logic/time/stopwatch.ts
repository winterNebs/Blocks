namespace ASC {
    export class Stopwatch {
        private _start: number;
        public constructor() {
        }
        public start(): void {
            this._start = performance.now();
        }
        public getTime(): number {
            return performance.now() - this._start;
        }
    }
}
