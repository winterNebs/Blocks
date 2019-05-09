import { GameManager } from "./game/gamemanager";
import { InputManager } from "./game/inputManager";
import { Config } from "./game/config/config";
import { Mode } from "./game/logic/enums";
import { MapData } from "./game/config/mapData";
export class Run {
    private _app: PIXI.Application;
    private _game: GameManager;
    public afterLoad;
    public constructor() {    }
    public init(): void {
        this._app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x333333 });
        this._app.view.setAttribute('tabindex', '0');

        document.body.onclick = () => (InputManager.setFocus(document.activeElement == this._app.view));

        // load sprites and run game when done
       // PIXI.Loader.shared.add('b','assets/textures/b.png').load(()=>(this.load()));
        this._app.view.onclick = () => (this._app.view.focus());
        document.body.insertBefore(this._app.view, document.body.childNodes[1]);
        this.load();
    }
    public startGame(config?: Config, mode?: Mode, mapdata?: MapData): void {
        try {
            this._game = new GameManager(config, mode, mapdata);

            for (var i = this._app.stage.children.length - 1; i >= 0; --i) {
                this._app.stage.removeChild(this._app.stage.children[i]);
                }
            this._app.stage.addChild(this._game.renderer);
        }
        catch (err) {
            alert("Error in config: " + err);
            this._game = new GameManager(new Config, Mode.PRACTICE, undefined);
        }
        this._game.resetGame();
        this._app.view.focus();
    }

    public load(): void {
        if (this.afterLoad == undefined) {
            this.startGame();
        }
        else {
            this.afterLoad();
        }
        this._app.view.focus();
        InputManager.initialize();
        let newGameButton: HTMLButtonElement = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (this._game.resetGame());
        document.body.appendChild(newGameButton);
        const lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold", "Instant Drop", "Restart", "Reset Piece", "DAS Left", "Das Right",];
        for (let i = 0; i < lables.length; ++i) {
            let be: HTMLButtonElement = document.createElement("button");
            be.innerText = lables[i];
            be.onclick = (ev) => { this._game.touchControl(i); ev.preventDefault(); };
            be.style.fontSize = "2em";
            document.body.appendChild(be);
        }
    }
}