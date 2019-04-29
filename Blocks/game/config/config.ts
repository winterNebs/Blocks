namespace ASC {
    export class Config {
        private _width: number;
        private _pieces: Piece[]; //o boi
        //RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
        private _controls: number[] = [];
        private _delay: number;
        private _repeat: number;
        private _bagSize: number;
        public constructor(w: number = 10, p: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
        new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
        new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)],
            c: number[] = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], d: number = 100, r: number = 10, b: number = 7) {
            this._width = w;
            this._bagSize = b;
            this._pieces = p;
            this._controls = c;
            this._delay = d;
            this._repeat = r;
        }
        public static fromText(input: string): Config {
            let cfg = JSON.parse(input);
            let ps: Piece[] = [];
            for (let i of cfg.pieces) {
                ps.push(new Piece(i[0], i[1], i[2], Number("0x" + i[3]), 0));
            }
            let config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        }
        public static pieceFromText(input: string): Piece[] {
            console.log(input);
            let p = JSON.parse(input);
            let ps: Piece[] = [];
            for (let i of p) {
                ps.push(new Piece(i._name, i._shape, i._offset, i._color));
            }
            return ps;
        }

        public get width(): number {
            return this._width;
        }
        public set width(value: number) {
            if (value != undefined && value >= ASC.MIN_FIELD_WIDTH && value <= ASC.MAX_FIELD_WIDTH) {
                this._width = value;
            }
            else {
                throw new Error("Invalid width in config: " + value);
            }
        }
        public get pieces(): ASC.Piece[] {
            return [...this._pieces].map(x => x.getCopy());
        }
        public set pieces(value: ASC.Piece[]) {
            if (value != undefined && value.length > 0) {
                this._pieces = [...value].map(x => x.getCopy());
            }
            else {
                throw new Error("Invalid pieces in config: " + value);
            }
        }
        public get controls(): number[] {
            return [...this._controls];
        }
        public set controls(value: number[]) {
            if (value != undefined && value.length > 0) {// Check if == to controls i g; don't really matter since they will hinder themselves
                this._controls = [...value];
            }
            else {
                throw new Error("Invalid controls in config: " + value);
            }
        }


        public get delay(): number {
            return this._delay;
        }
        public set delay(value: number) {
            if (value != undefined && value > 0) {
                this._delay = value;
            }
            else {
                throw new Error("Invalid delay in config: " + value);
            }
        }
        public get repeat(): number {
            return this._repeat;
        }
        public set repeat(value: number) {
            if (value != undefined && value > 0) {
                this._repeat = value;
            }
            else {
                throw new Error("Invalid repeat in config: " + value);
            }
        }
        public get bagSize(): number {
            return this._bagSize;
        }
        public set bagSize(value: number) {
            if (value != undefined && value > 0) {
                this._bagSize = value;
            }
            else {
                throw new Error("Invalid bag size in config: " + value);
            }
        }
    }
}