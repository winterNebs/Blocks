namespace ASC {
    export const MAX_FIELD_WIDTH: number = 20;
    export const MIN_FIELD_WIDTH: number = 5;
    export const FIELD_HEIGHT: number = 25;

    export class Field {
        private _width: number;
        private _array: Block[] = [];

        public constructor(width: number) {
            this._width = width;
            this.initialize();
        }

        private initialize(): void {
            for (let i = 0; i < this._width * FIELD_HEIGHT; ++i) {
                this._array.push(new Block());
            }
        }

        private shift(lines: number): void { // take garbage or something;
            this._array.splice(0, lines * this._width);
            for (let i = 0; i < lines * this._width; ++i) {
                this._array.push(new Block());
            }
        }

        public getAt(index: number): Block {
            return this._array[index];
        }
        
        public getColors(): number[] {
            let c: number[] = [];
            for (let i of this._array) {
                c.push(i.color);
            }
            return c;
        }
        public setBlocks(indices: number[], block: Block) :void{
            for (let i of indices) {
                this._array[i] = block;
            }
        }
    }
}