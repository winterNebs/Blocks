import { Renderer } from "../renderer/renderer";
import { ITriggerObserver } from "./ITriggerObserver";
import { AGame } from "./modes/Agame";
import { Config } from "./config/config";
import { MapData } from "./config/mapData";
import { Timer } from "./logic/time/timer";
import { Mode, Inputs, FIELD_HEIGHT, State } from "./logic/enums";
import { Game } from "./modes/game";
import { MapGame } from "./modes/mapgame";
import { DigGame } from "./modes/diggame";
import { InputManager } from "./inputManager";
import { Piece } from "./logic/piece";
import { NUM_PREVIEWS } from "./logic/queue/Aqueue";

export class GameManager implements ITriggerObserver {
    private _visible: boolean = true;
    private _renderer: Renderer;
    private _game: AGame;
    private _config: Config;
    private _mapdata: MapData;
    private _controls: number[];
    private _replay: number[] = [];
    private _timer: Timer;
    private _instant: boolean;
    public constructor(c: Config, mode: Mode, mapdata?: MapData) {
        this._config = c.getCopy();
        this._mapdata = mapdata;
        this._instant = this._config.repeat == 0;
        switch (mode) {
            case Mode.PRACTICE:
                this._game = new Game(this._config.width, this._config.bagSize, this._config.pieces);
                break;
            case Mode.MAP:
                this._game = new MapGame(this._mapdata.width, this._config.bagSize, mapdata.pieces,
                    this._mapdata.queue, this._mapdata.clearable, this._mapdata.unclearable);
                this._config.width = this._mapdata.width;
                break;
            case Mode.DIG:
                this._game = new DigGame(this._config.width, this._config.bagSize, this._config.pieces);
                break;
            case Mode.VS:
                break;
        }
        this._controls = this._config.controls;
        this._renderer = new Renderer(this._config.width, "Attack");
        InputManager.RegisterObserver(this);
        InputManager.RegisterKeys(this, [this._config.controls[Inputs.LEFT], this._config.controls[Inputs.RIGHT], this._config.controls[Inputs.SD]], this._config.delay, this._config.repeat);
        this._game.setUpdate(this.updateGame.bind(this));
        this._game.setUpdateHold(this.updateHold.bind(this));
        this._game.setUpdateQueue(this.updateQueue.bind(this));
        this._game.setUpdateField(this.updateField.bind(this));

    }

    public resetGame(): void {
        this._game.resetGame();
    }
    private updateGame(): void {
        this._renderer.updateProgress(this._game.progress.toString());
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
                temp[point] = GameManager.minGray((ghost.color & 0xfefefe) >> 1); /// for now
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
        r = Math.max(r, 20);
        g = Math.max(g, 20);
        b = Math.max(b, 20);
        return r * 65536 + g * 256 + b;

    }
    public touchControl(code: number): void {
        const touchMap = [Inputs.LEFT, Inputs.SD, Inputs.RIGHT, Inputs.CW, Inputs.CWCW, Inputs.CCW, Inputs.HD, Inputs.HOLD, Inputs.SONIC, Inputs.RESTART, Inputs.RP,Inputs.LL, Inputs.RR, ];
        
        if (Inputs.RESTART == touchMap.indexOf(code)) { //f4
            this.resetGame();
        }
        else if (this._game.state == State.ACTIVE) {
            this._game.readinput(touchMap.indexOf(code));
        }
    }
    Triggered(keyCode: number, repeat: boolean): void {
        if (this._instant && repeat) {
            switch (keyCode) {
                case this._controls[Inputs.RIGHT]:
                    this._game.readinput(Inputs.RR);
                    break;
                case this._controls[Inputs.LEFT]:
                    this._game.readinput(Inputs.LL);
                    break;
                default:
                    break;
            }
        }
        else {
            this._game.readinput(this._controls.indexOf(keyCode));
        }
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
    public setReplay(seed: number, replay: string): void {
        this._game.resetGame(seed);
        this._replay = replay.split(',').map(x => parseInt(x));
        this._timer = new Timer((this._replay.length + 5) * 50, 50, this.replay.bind(this), () => (console.log("done")));
        this._timer.start();
    }

    private replay() {
        if (this._replay.length > 0) {
            this._game.readinput(this._replay.shift());
            this._game.update();
        }
        else {
            this._timer.stop();
        }
    }
    public get renderer(): Renderer {
        return this._renderer;
    }
}