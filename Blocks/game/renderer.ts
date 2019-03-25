namespace ASC {
    export class Renderer extends PIXI.Container {
        private _field: RenderGrid;
        private _queue: RenderGrid[] = [];
        public constructor(width: number, queueSize: number) {
            super();
            this._field = new RenderGrid(width, FIELD_HEIGHT, 24);
            this.addChild(this._field);
            for (let i = 0; i < queueSize; ++i) {
                this._queue.push(new RenderGrid(5, 5, 10, width * 24, 10 * 5 * i));
                this.addChild(this._queue[i]);
            }
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
    }
}