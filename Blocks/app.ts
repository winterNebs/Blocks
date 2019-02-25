

var engine: TSE.Engine;
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
}

window.onresize = function () {
    engine.resize();
}