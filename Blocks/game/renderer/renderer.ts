namespace ASC {
    const FIELD_SIZE = 24;
    const SMALL_SIZE = 10;
    export class Renderer extends PIXI.Container {
        private _field: RenderGrid;
        private _queue: RenderGrid[] = [];
        private _hold: RenderGrid;
        private _progress: PIXI.Text;
        private _time: PIXI.Text;
        private _progressText: string;
        public constructor(width: number, progress: string) {
            super();
            this._field = new RenderGrid(width, FIELD_HEIGHT, FIELD_SIZE, SMALL_SIZE * 5);
            this.addChild(this._field);
            for (let i = 0; i < NUM_PREVIEWS; ++i) {
                this._queue.push(new RenderGrid(5, 5, 10, width * FIELD_SIZE + SMALL_SIZE * 5, 10 * 5 * i));
                this.addChild(this._queue[i]);
            }
            this._hold = new RenderGrid(5, 5, 10);
            this.addChild(this._hold);
            this._progressText = progress;
            this._progress = new PIXI.Text(progress + "\n", { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
            this._progress.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            this._progress.y = SMALL_SIZE * 5 * NUM_PREVIEWS + 10;
            this.addChild(this._progress);
            this._time = new PIXI.Text("\n\nhi", { fontFamily: 'Arial', fontSize: 24, fill: 0x000000, align: 'center' });
            this._time.x = width * FIELD_SIZE + SMALL_SIZE * 5 + 10;
            this._time.y = SMALL_SIZE * 5 * NUM_PREVIEWS + 10;
            this.addChild(this._time);
        }
        public updateField(Field: number[]): void {
            this._field.updateGrid(Field);
        }
        public updateQueue(q: number[][]): void {
            for (let i = 0; i < q.length; ++i) {
                this._queue[i].updateGrid(q[i]);
            }
        }
        public updateHold(p: number[]): void {
            this._hold.updateGrid(p);
        }
        public updateProgress(t: string): void {
            this._progress.text = this._progressText + "\n" + t;
        }
        public updateTime(t: string): void {
            this._time.text ="\n\nTime:" + t;
        }
    }
}