/// <reference path="agame.ts" />
namespace ASC {
    //TODO:
    //Score
    const TIMELIMIT: number = 60;
    export class MapGame extends AGame {
        private _map: number[];
        private _progress: number = 0;
        private _attack: AttackTable;
        private _order: number[];
        private _timer: Timer;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        public constructor(
            width: number = 12, bagSize: number = 6,
            pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)],
            controls: number[] = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115],
            order: number[] = [], clearable: number[] = [],
            delay: number = 100, repeat: number = 10) {

            super(width, bagSize, pieces, controls, delay, repeat);
            this._map = clearable;
            this._order = order;
            this._attack = new AttackTable(this._width);

            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
        }

        public resetGame(): void {
            this._queue = new StaticQueue(this._pieces, this._order);
            this._progress = 0;
            super.resetGame();
            this._field.setBlocks(this._map, new Block(0xDDDDDD, true, true));
            this.update();
        }
        protected tick(): void {
            this.updateTime();
        }
        protected gameOver(): void {
            super.gameOver();
            this.updateTime();
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
                    this.gameOver();
                    this._renderer.updateTime("You Win");
                }
            }
        }

        protected update(): void {
            super.update();
            this.updateProgress();
        }

        protected updateProgress(): void {
            this._renderer.updateProgress(this._progress.toString());
        }

        private updateTime(): void {
            this._renderer.updateTime("Timer off for now :)");
            //this._renderer.updateTime((this._timer.elapsed / 1000).toString());
        }
    }
}