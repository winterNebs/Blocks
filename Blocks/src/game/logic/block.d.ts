declare namespace ASC {
    class Block {
        private _color;
        private _solid;
        private _clearable;
        /**
         * Creates a new block.
         * @param color Color of the block in hex, (Default: 0x000000).
         * @param solid Solidity of the block, (Default: false).
         * @param clearable Clearabliltiy of the block, (Default: false).
         */
        constructor(color?: number, solid?: boolean, clearable?: boolean);
        readonly color: number;
        readonly solid: boolean;
        readonly clearable: boolean;
    }
}
