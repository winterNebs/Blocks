var app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
app.view.setAttribute('tabindex', '0');
document.body.onclick = function () {
    ASC.InputManager.setFocus(document.activeElement == app.view);
}

// load sprites and run game when done
PIXI.loader.add('assets/textures/b.png').load(load);
document.body.appendChild(app.view);
let game: ASC.Game;

function startGame(config: ASC.Config) {
    if (config === null) {
        game = new ASC.Game();
    }
    else {
        game = new ASC.Game(config._width, config._bagSize, config._pieces, config._controls, config._delay, config._repeat);
    }
    ASC.InputManager.initialize();

}
function load() {
    startGame(null);
    let discord = document.createElement("a");
    discord.setAttribute("href", "https://discord.gg/GjScWEh");
    discord.innerText = "discord";
    document.body.appendChild(discord);
    let newGameButton: HTMLButtonElement = document.createElement("button");
    newGameButton.innerText = "New Game";
    newGameButton.onclick = () => (game.resetGame());
    document.body.appendChild(newGameButton);
}
