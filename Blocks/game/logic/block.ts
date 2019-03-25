namespace ASC {
    //Representation of a block.
    export class Block {
        private _color: number;
        private _solid: boolean;
        private _clearable: boolean;
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
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