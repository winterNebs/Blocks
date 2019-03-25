namespace ASC {
    export class Renderer extends PIXI.Container {
        private _field: RenderGrid;
        private _queue: RenderGrid[] = [];
        private _hold: RenderGrid;
        public constructor(width: number, queueSize: number) {
            super();
            this._field = new RenderGrid(width, FIELD_HEIGHT, 24,10*5);
            this.addChild(this._field);
            for (let i = 0; i < queueSize; ++i) {
                this._queue.push(new RenderGrid(5, 5, 10, width * 24 + 10 * 5, 10 * 5 * i));
                this.addChild(this._queue[i]);
            }
            this._hold = new RenderGrid(5, 5, 10);
            this.addChild(this._hold);
        }
        public updateField(Field: number[]): void {
            this._field.updateGrid(Field);
        }
        public updateQueue(q: number[][]): void {
            for (let i = 0; i < q.length; ++i) {
                console.log(q[i]);
                this._queue[i].updateGrid(q[i]);
            }
        }
        public updateHold(p: number[]): void {
            this._hold.updateGrid(p);
        }
    }
}