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
            //this._width = 12;
            //this._queueSize = 6;
            //this._pieces = [new Piece("T", [7, 11, 12, 13], 2), new Piece("L", [8, 11, 12, 13], 2), new Piece("J", [6, 11, 12, 13], 2),
            //new Piece("Z", [11, 12, 17, 18], 2), new Piece("S", [12, 13, 16, 17], 2), new Piece("I", [11, 12, 13, 14], 2), new Piece("O", [12, 13, 17, 18], 2)];
            //this._controls = [39, 40, 37, 38, 83, 68, 16, 32];
            //this._delay = 100;
            //this._repeat = 10;
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
                ps.push(new Piece(i[0], i[1], i[2]));
            }
            let config = new Config(cfg.width, ps, cfg.controls, cfg.delay, cfg.repeat, cfg.bagSize);
            return config;
        }
    }
}