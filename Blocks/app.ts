namespace RUN {
    export var app: PIXI.Application;
    export var game: ASC.Game;
    export var afterLoad;
    export function init() {
        app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
        app.view.setAttribute('tabindex', '0');
        document.body.onclick = function () {
            ASC.InputManager.setFocus(document.activeElement == app.view);
        }

        // load sprites and run game when done
        PIXI.loader.add('assets/textures/b.png').load(load);
        document.body.appendChild(app.view);


    }
    export function startGame(config?: ASC.Config, static: boolean = false, queue: number[] = [], map: number[] = []) {
        try {
            if (config !== undefined) {
                game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, static, queue, map, config._delay, config._repeat);
            }
            else {
                game = new ASC.Game();
            }
        }
        catch (err) {
            alert("Error in config: " + err);
            game = new ASC.Game();
        }
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
        let discord = document.createElement("a");
        discord.setAttribute("href", "https://discord.gg/GjScWEh");
        discord.innerText = "discord";
        document.body.appendChild(discord);
        let newGameButton: HTMLButtonElement = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (game.resetGame());
        document.body.appendChild(newGameButton);
        let lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold"];
        for (let i = 0; i < lables.length; ++i) {
            let be: HTMLButtonElement = document.createElement("button");
            be.innerText = lables[i];
            be.onclick = function (ev) { game.touchControl(i); ev.preventDefault()};
            be.style.fontSize = "2em";
            document.body.appendChild(be);
        }

    }
}