namespace ASC {
    export class Block {
        private _color: number;
        private _solid: boolean;
        private _clearable: boolean;
        public constructor(color: number = 0x000000, solid: boolean = false, clearable: boolean = false) {
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        public get color():number {
            return this._color;
        }
        public get solid(): boolean {
            return this._solid;
        }
        public get clearable(): boolean {
            return this._clearable;
        }
    }

}