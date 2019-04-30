namespace ASC {
    export class GameManager implements ITriggerObserver {
        private _visible: boolean = true;
        private _renderer: Renderer;
        private _game: AGame;
        private _config: Config;
        private _mapdata: MapData;
        private _controls: number[];
        public constructor(c: Config, mode: Mode, mapdata?: MapData) {
            this._config = c;
            this._mapdata = mapdata;

            switch (mode) {
                case Mode.PRACTICE:
                    this._game = new Game(this._config.width, this._config.bagSize, this._config.pieces,
                        this._config.delay, this._config.repeat);
                    break;
                case Mode.MAP:
                    this._game = new ASC.MapGame(this._mapdata.width, this._config.bagSize, mapdata.pieces,
                        this._mapdata.queue, this._mapdata.clearable, this._mapdata.unclearable, this._config.delay, this._config.repeat);
                    this._config.width = this._mapdata.width;
                    break;
                case Mode.DIG:
                    this._game = new ASC.DigGame(this._config.width, this._config.bagSize, this._config.pieces,
                        this._config.delay, this._config.repeat);
                    break;
                case Mode.VS:
                    break;
            }
            this._controls = this._config.controls;
            this._renderer = new Renderer(this._config.width, "Attack");
            for (var i = RUN.app.stage.children.length - 1; i >= 0; --i) {
                RUN.app.stage.removeChild(RUN.app.stage.children[i]);
            }
            InputManager.RegisterObserver(this);
            InputManager.RegisterKeys(this, [this._config.controls[Inputs.LEFT], this._config.controls[Inputs.RIGHT], this._config.controls[Inputs.SD]], this._config.delay, this._config.repeat);
            RUN.app.stage.addChild(this._renderer);
            this._game.setUpdate(this.updateGame.bind(this));
            this._game.setUpdateHold(this.updateHold.bind(this));
            this._game.setUpdateQueue(this.updateQueue.bind(this));
            this._game.setUpdateField(this.updateField.bind(this));

        }

        public resetGame(): void {
            this._game.resetGame();
        }
        private updateGame(): void {
            if (this._game.state == State.ACTIVE) {
                this._renderer.updateTime((this._game.time / 1000).toString());
            }
            else if (this._game.state == State.WIN) {
                this._renderer.updateTime("You won in: " + (this._game.time / 1000).toString());
            }
            else if (this._game.state == State.LOSE) {
                this._renderer.updateTime("You lost in: " + (this._game.time / 1000).toString());
            }
        }

        private updateHold(hold: Piece): void {

            if (hold === undefined) {
                let temp = [];
                for (let i = 0; i < 25; ++i) {
                    temp.push(0x000000);
                }
                this._renderer.updateHold(temp);
            }
            else {
                this._renderer.updateHold(hold.getRenderShape());
            }
        }

        private updateQueue(queue: Piece[]): void {

            while (queue.length < NUM_PREVIEWS) {
                queue.push(undefined);
            }
            let q: number[][] = [];
            for (let p of queue) {
                if (p == undefined) {
                    q.push(new Array(25).fill(0));
                }
                else {
                    q.push(p.getRenderShape());
                }
            }
            this._renderer.updateQueue(q);
        }

        private updateField(temp: number[], current: Piece, ghost: Piece) {
            if (current != undefined) {
                for (let point of ghost.getCoords(this._config.width)) {
                    temp[point] = (ghost.color & 0xfefefe) >> 1;; /// for now
                }
                for (let point of current.getCoords(this._config.width)) {
                    temp[point] = GameManager.minGray(current.color); /// for now
                }
                for (let i = 0; i < 5; ++i) {
                    for (let j = 0; j < 5; ++j) {

                        let index = i + current.xy[0] + (j + current.xy[1]) * this._config.width;
                        if (i + current.xy[0] >= 0 && i + current.xy[0] < this._config.width &&
                            j + current.xy[1] >= 0 && j + current.xy[1] < FIELD_HEIGHT) {
                            if (i == 2 && j == 2) {
                                temp[index] = GameManager.darken(temp[index]);
                            }
                            else {
                                temp[index] = GameManager.lighten(temp[index]);
                            }

                        }
                    }
                }
            }
            this._renderer.updateField(temp);
        }
        private static lighten(hex: number): number {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.min(r + 50, 255);
            g = Math.min(g + 50, 255);
            b = Math.min(b + 50, 255);
            return r * 65536 + g * 256 + b;
        }
        private static darken(hex: number): number {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.max(r - 50, 0);
            g = Math.max(g - 50, 0);
            b = Math.max(b - 50, 0);
            return r * 65536 + g * 256 + b;
        }
        private static minGray(hex: number): number {
            let r = (hex >> 16) & 255;
            let g = (hex >> 8) & 255;
            let b = hex & 255;
            r = Math.max(r, 10);
            g = Math.max(g, 10);
            b = Math.max(b, 10);
            return r * 65536 + g * 256 + b;

        }
        public touchControl(code: number): void {
            const touchMap = [Inputs.LEFT, Inputs.SD, Inputs.RIGHT, Inputs.CW, Inputs.CWCW, Inputs.CCW, Inputs.HD, Inputs.HOLD, Inputs.SONIC];
            if (this._game.state == State.ACTIVE) {
                this._game.readinput(touchMap.indexOf(code));
            }
            if (code == 9) { //f4
                this.resetGame();
            }
        }
        Triggered(keyCode: number): void {
            this._game.readinput(this._controls.indexOf(keyCode));
            switch (keyCode) {
                case this._controls[Inputs.RIGHT]:
                    InputManager.cancelRepeat(this._controls[Inputs.LEFT]);
                    break;
                case this._controls[Inputs.LEFT]:
                    InputManager.cancelRepeat(this._controls[Inputs.RIGHT]);
                    break;
                default:
                    break;
            }
            if (keyCode == this._controls[Inputs.RESTART]) { //f4
                this.resetGame();
            }
        }
    }
}