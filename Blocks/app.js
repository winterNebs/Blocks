var app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
document.body.appendChild(app.view);
var game;
// load sprites and run game when done
PIXI.loader.add('assets/textures/b.png').load(load);
function load() {
    game = new ASC.Game(10);
    ASC.InputManager.initialize();
}
//# sourceMappingURL=app.js.map