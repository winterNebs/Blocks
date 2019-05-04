import { AGame } from "./Agame";
import { Timer } from "../logic/time/timer";
import { AttackTable } from "../logic/scoring/attackTable";
import { Piece } from "../logic/piece";
import { Queue } from "../logic/queue/queue";

    //TODO:
    //Score
    const TIMELIMIT: number = 60;
    export class Game extends AGame {
        //Separte gamemodes
        private _timer: Timer;
        private _progress: number = 0;
        private _attack: AttackTable;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(
            width: number = 12, bagSize: number = 7,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], delay: number = 100, repeat: number = 10) {

            super(width, bagSize, pieces, delay, repeat);
            this._attack = new AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
        }
        public resetGame(seed?:number): void {
            this._progress = 0;
            if (seed != undefined) {
                this._seed = seed;
            }
            else {
                this.randomSeed();
            }
            this._queue = new Queue(this._seed, this._pieces, this._bagSize);
            super.resetGame(this._seed);
        }

        protected lock() {
            let spin = this.checkImmobile();
            let yvals = this._currentPiece.getYVals();
            super.lock();
            let cleared = this.clearLines(yvals);

            if (cleared > 0) {
                if (spin) {
                    this._progress += this._attack.spin(cleared);
                }
                else {
                    this._progress += this._attack.clear(cleared);
                }
                if (this.checkPC()) {
                    this._progress += this._attack.perfectClear(cleared);
                }
            }
        }
    }
