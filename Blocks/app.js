var RUN;
(function (RUN) {
    function init() {
        RUN.app = new PIXI.Application(800, 600, { backgroundColor: 0x333333 });
        RUN.app.view.setAttribute('tabindex', '0');
        document.body.onclick = function () {
            ASC.InputManager.setFocus(document.activeElement == RUN.app.view);
        };
        // load sprites and run game when done
        PIXI.loader.add('assets/textures/b.png').load(load);
        RUN.app.view.onclick = () => (RUN.app.view.focus());
        document.body.appendChild(RUN.app.view);
    }
    RUN.init = init;
    function startGame(config, static = false, queue = [], map = []) {
        // try {
        if (config !== undefined) {
            if (static) {
                RUN.game = new ASC.MapGame(config._width, config._bagSize, config._pieces, config._controls, queue, map, config._delay, config._repeat);
            }
            else {
                RUN.game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, config._delay, config._repeat);
            }
        }
        else {
            RUN.game = new ASC.Game();
        }
        //}
        // catch (err) {
        //     alert("Error in config: " + err);
        //    game = new ASC.Game();
        // }
        RUN.game.resetGame();
        RUN.app.view.focus();
    }
    RUN.startGame = startGame;
    function load() {
        if (RUN.afterLoad == undefined) {
            startGame();
        }
        else {
            RUN.afterLoad();
        }
        RUN.app.view.focus();
        ASC.InputManager.initialize();
        let newGameButton = document.createElement("button");
        newGameButton.innerText = "New Game";
        newGameButton.onclick = () => (RUN.game.resetGame());
        document.body.appendChild(newGameButton);
        let lables = ["Left", "Softdrop", "Right", "Clockwise", "180", "Counter Clockwise", "Hard Drop", "Hold", "Instant Drop", "Restart"];
        for (let i = 0; i < lables.length; ++i) {
            let be = document.createElement("button");
            be.innerText = lables[i];
            be.onclick = function (ev) { RUN.game.touchControl(i); ev.preventDefault(); };
            be.style.fontSize = "2em";
            document.body.appendChild(be);
        }
    }
})(RUN || (RUN = {}));
