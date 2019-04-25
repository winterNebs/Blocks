/// <reference path="agame.ts" />
var ASC;
(function (ASC) {
    //TODO:
    //Score
    const TIMELIMIT = 60;
    class Game extends ASC.AGame {
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width = 12, bagSize = 6, pieces = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900),
            new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF), new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00),
            new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)], controls = [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], delay = 100, repeat = 10) {
            super(width, bagSize, pieces, controls, delay, repeat);
            this._progress = 0;
            this._attack = new ASC.AttackTable(this._width);
            //this._timer = new Timer(this.tick.bind(this), this.gameOver.bind(this), 500, 60000);
        }
        resetGame() {
            this._progress = 0;
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces, this._bagSize);
            super.resetGame();
        }
        tick() {
            this.updateTime();
        }
        gameOver() {
            super.gameOver();
            this.updateTime();
            //this._timer.stop();
        }
        lock() {
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
        update() {
            super.update();
            this.updateProgress();
        }
        updateProgress() {
            this._renderer.updateProgress(this._progress.toString());
        }
        updateTime() {
            this._renderer.updateTime("Timer off for now :)");
            //this._renderer.updateTime((this._timer.elapsed / 1000).toString());
        }
    }
    ASC.Game = Game;
})(ASC || (ASC = {}));
