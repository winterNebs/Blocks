namespace ASC {
    export class Config {
        public _width: number;
        public _pieces: Piece[]; //o boi
        //RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD
        public _controls: number[] = [];
        public _delay: number;
        public _repeat: number;
        public _bagSize: number;
        public constructor(w: number, p: Piece[], c: number[], d: number, r: number, b: number) {
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
                ps.push(new Piece(i[0], i[1], i[2], Number("0x"+i[3]),0));
            }
            let config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        }
    }
}