import { AGame } from "./Agame";
import { Timer } from "../logic/time/timer";
import { AttackTable } from "../logic/scoring/attackTable";
import { AGarbage } from "../logic/garbage/Agarbage";
import { Piece } from "../logic/piece";
import { Garbage } from "../logic/garbage/garbage";
import { Queue } from "../logic/queue/queue";
import { Block } from "../logic/block";
import { FIELD_HEIGHT,State } from "../logic/enums";

    export class DigGame extends AGame {
        //Separte gamemodes
        private _timer: Timer;
        private _attack: AttackTable;
        private _garbage: AGarbage;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(
            width: number = 10, bagSize: number = 6,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
                new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)]) {

            super(width, bagSize, pieces);
            this._attack = new AttackTable(this._width);
            this._timer = new Timer(120000, 2000, this.tick.bind(this), this.win.bind(this));
        }
        public resetGame(seed?:number): void {
            this._progress = 0;
            if (seed != undefined) {
                this._seed = seed;
            }
            else {
                this.randomSeed();
            }
            this._garbage = new Garbage(this._seed, this._width, 0.9);
            this._queue = new Queue(this._seed, this._pieces, this._bagSize);
            this._timer.start();
            super.resetGame(this._seed);
        }
        protected gameOver() :void{
            this._timer.stop();
            super.gameOver();
        }
        protected tick(): void {
            this.addGarbage(~~(Math.random() * 4));
            this.update();
        }
        private win(): void {
            super.gameOver();
            this._state = State.WIN;
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
                
        private addGarbage(attack: number = 1): void {
            let garbage: Block[][] = [];
            let g: number[][] = this._garbage.addGarbage(attack);
            for (let row of g) {
                garbage.push([])
                for (let b of row) {
                    if (b == 1) {
                        garbage[garbage.length - 1].push(new Block(0xDDDDDD, true, true))
                    }
                    else {
                        garbage[garbage.length - 1].push(new Block(0x000000, false, false))
                    }
                }
            }
            super.appendRow(garbage, FIELD_HEIGHT);
            this.checkGarbageShift();
        }

        private checkGarbageShift(): void {
            let y = 0;
            let highest: number = this._currentPiece.getYVals().sort(function (a, b) { return a - b })[0];
            while (!this.checkShift(0, y)) {
                --y;
                if (highest + y == 0) {
                    this.hardDrop();
                    return;
                }
                else if (highest + y < 0) {
                    this.gameOver();
                    return;
                }
            }
            this._currentPiece.move(0, y);
        }
    }
