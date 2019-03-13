var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

let game: ASC.Game;

// load sprites and run game when done
PIXI.loader.add('assets/textures/b.png').load(load);


function load() {
    game = new ASC.Game(10);
    ASC.InputManager.initialize();
}