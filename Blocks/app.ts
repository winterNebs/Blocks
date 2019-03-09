var app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
document.body.appendChild(app.view);

//let game = new Game(app);

// load sprites and run game when done
PIXI.loader.add('blocks', 'assets/textures/b.png').load(//() => game.run()
);