namespace ASC {
    export class Timer {
        private _expected: number;
        private _timeout: number;
        private _interval: number;
        private _tick: Function;
        private _finish: Function;
        private _end: number;
        private _expectedEnd: number;
        private _elapsed: number = 0;
        private _running: boolean = false;

        public constructor(tick: Function, finish: Function, interval: number, end:number) {
            this._finish = finish;
            this._interval = interval;
            this._tick = tick;
            this._end = end;
        }
        public start(): void {
            this.stop();
            this._running = true;
            this._elapsed = 0;
            this._expectedEnd = Date.now() + this._end;
            this._expected = Date.now() + this._interval;
            this._timeout = window.setTimeout(this.step.bind(this), this._interval);
        }
        public stop(): void {
            if (this._running) {
            clearTimeout(this._timeout);
            }
            this._running = false;
        }

        public step(): void {
            if (this._running) {
                this._elapsed += this._interval;
                if (Date.now() >= this._expectedEnd) {
                    this.stop();
                    this._finish();
                    return;
                }
                var drift = Date.now() - this._expected;
                this._tick();
                this._expected += this._interval;
                this._timeout = window.setTimeout(this.step.bind(this), Math.max(0, this._interval - drift));
            }
            else {
                this.stop();
            }
        }
        public get elapsed(): number {
            return this._elapsed;
        }
    }
}