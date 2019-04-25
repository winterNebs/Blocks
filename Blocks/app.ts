
namespace RUN {
    export var app: PIXI.Application;
    export var game: ASC.AGame;
    export var afterLoad;
    export function init() {
        app = new PIXI.Application(800, 600, { backgroundColor: 0x333333 });
        app.view.setAttribute('tabindex', '0');

        document.body.onclick = function () {
            ASC.InputManager.setFocus(document.activeElement == app.view);
        }

        // load sprites and run game when done
        PIXI.loader.add('assets/textures/b.png').load(load);
        app.view.onclick = () => (app.view.focus());
        document.body.appendChild(app.view);


    }
    export function startGame(config?: ASC.Config, static: boolean = false, queue: number[] = [], map: number[] = []) {
        try {
            if (config !== undefined) {
                if (static) {
                    game = new ASC.MapGame(config._width, config._bagSize, config._pieces, config._controls, queue, map, config._delay, config._repeat);
                }
                else {
                    game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, config._delay, config._repeat);
                }
            }
            else {
                game = new ASC.Game();
            }
        }
        catch (err) {
            alert("Error in config: " + err);
            game = new ASC.Game();
        }
        game.resetGame();
        app.view.focus();
    }

    function load() {
        if (afterLoad == undefined) {
            startGame();
        }
        else {
            afterLoad();
        }
        app.view.focus();
        ASC.InputManager.initialize();
        let newGameButton: HTMLButtonElement = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (game.resetGame());
        document.body.appendChild(newGameButton);
        let lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold", "Instant Drop", "Restart"];
        for (let i = 0; i < lables.length; ++i) {
            let be: HTMLButtonElement = document.createElement("button");
            be.innerText = lables[i];
            be.onclick = function (ev) { game.touchControl(i); ev.preventDefault() };
            be.style.fontSize = "2em";
            document.body.appendChild(be);
        }

    }
}