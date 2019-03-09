namespace ASC {
    export class Block {
        private _color: TSE.Color;
        private _solid: boolean;
        private _clearable: boolean;
        public constructor(color: TSE.Color = TSE.Color.black(), solid: boolean = false, clearable: boolean = false) {
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        public getColor(): number[] {
            return this._color.toArray();
        }
    }

}