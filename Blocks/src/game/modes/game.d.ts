/// <reference path="Agame.d.ts" />
declare namespace ASC {
    class Game extends AGame {
        private _timer;
        private _progress;
        private _attack;
        /**
         * Creates a new game
         * @param width Width of the game feild, (5 < width < 20, Default: 12).
         */
        constructor(width?: number, bagSize?: number, pieces?: Piece[], delay?: number, repeat?: number);
        resetGame(seed?: number): void;
        protected lock(): void;
    }
}
