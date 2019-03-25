﻿var configText = prompt("Enter Config Data (Check out the discord for more info: https://discord.gg/GjScWEh)", `{"width": 10,"pieces":[["T", [7, 11, 12, 13], 2],["L", [8, 11, 12, 13], 2],["J", [6, 11, 12, 13], 2],["Z", [11, 12, 17, 18], 2],["S", [12, 13, 16, 17], 2],	["I", [11, 12, 13, 14], 2],	["O", [12, 13, 17, 18], 2]],"controls": [39, 40, 37, 38, 83, 68, 16, 32],"delay": 100,"repeat": 10,"queueSize": 6}`);

if (configText == null || configText == "") {
    configText = `{"width": 10,"pieces":[["T", [7, 11, 12, 13], 2],["L", [8, 11, 12, 13], 2],["J", [6, 11, 12, 13], 2],["Z", [11, 12, 17, 18], 2],["S", [12, 13, 16, 17], 2],	["I", [11, 12, 13, 14], 2],	["O", [12, 13, 17, 18], 2]],"controls": [39, 40, 37, 38, 83, 68, 16, 32],"delay": 100,"repeat": 10,"queueSize": 6}`;
} 
var app = new PIXI.Application(800, 600, { backgroundColor: 0x423c3e });
document.body.appendChild(app.view);

let game: ASC.Game;
let config: ASC.Config;
// load sprites and run game when done
PIXI.loader.add('assets/textures/b.png').load(load);
function load() {
    try {
        config = ASC.Config.fromText(configText);
    }
    catch(err){
        alert("Something went wrong, using default config: " + err.message);
        config = ASC.Config.fromText(`{"width": 10,"pieces":[["T", [7, 11, 12, 13], 2],["L", [8, 11, 12, 13], 2],["J", [6, 11, 12, 13], 2],["Z", [11, 12, 17, 18], 2],["S", [12, 13, 16, 17], 2],	["I", [11, 12, 13, 14], 2],	["O", [12, 13, 17, 18], 2]],"controls": [39, 40, 37, 38, 83, 68, 16, 32],"delay": 100,"repeat": 10,"queueSize": 6}`);
    }
    game = new ASC.Game(config._width,config._queueSize, config._pieces, config._controls, config._delay, config._repeat);
    ASC.InputManager.initialize();
}