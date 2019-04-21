var RUN;
(function (RUN) {
    function init() {
        RUN.app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
        RUN.app.view.setAttribute('tabindex', '0');
        document.body.onclick = function () {
            ASC.InputManager.setFocus(document.activeElement == RUN.app.view);
        };
        // load sprites and run game when done
        PIXI.loader.add('assets/textures/b.png').load(load);
        document.body.appendChild(RUN.app.view);
    }
    RUN.init = init;
    function startGame(config, static = false, queue = [], map = []) {
        try {
            if (config !== undefined) {
                RUN.game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, static, queue, map, config._delay, config._repeat);
                /* game = new ASC.Game(10, config._bagSize, [new ASC.Piece("lol", [4, 7,], 0, 0xFF0000)], config._controls, true, [0, 0, 0, 0, 0, 0, 0], [
                    210, 211, 212, 213, 214, 216, 217, 218, 219, 220, 221, 222, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 235, 236, 237, 238, 239, 240, 241, 243, 244, 245, 246, 247, 248, 249
                ], config._delay, config._repeat);*/
            }
            else {
                RUN.game = new ASC.Game();
            }
        }
        catch (err) {
            alert("Error in config: " + err);
            RUN.game = new ASC.Game();
        }
        RUN.app.view.focus();
    }
    RUN.startGame = startGame;
    function load() {
        startGame();
        RUN.app.view.focus();
        ASC.InputManager.initialize();
        let discord = document.createElement("a");
        discord.setAttribute("href", "https://discord.gg/GjScWEh");
        discord.innerText = "discord";
        document.body.appendChild(discord);
        let newGameButton = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (RUN.game.resetGame());
        document.body.appendChild(newGameButton);
    }
})(RUN || (RUN = {}));
