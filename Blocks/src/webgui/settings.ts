
import { Run } from "../app";
import { Config } from "../game/config/config";
import { MapData } from "../game/config/mapData";
import { Mode, MIN_FIELD_WIDTH, MAX_FIELD_WIDTH, FIELD_HEIGHT } from "../game/logic/enums";
import { Piece } from "../game/logic/piece";
import { PieceEditor } from "./pieceeditor";
import { Drag } from "./dragutil";
import { toNumber, binaryFrom64, hexFrom64 } from "./numberarrayconverter";

const VERSION = 0.002;
export class Settings {
    private static _staticQueue: number[] = [];
    private static _mapShape: number[] = [];
    private static _config: Config;
    private static _mapData: MapData;
    private static _pieceEditor: PieceEditor;
    private static _widthSlider: HTMLInputElement;
    private static _mode: Mode = Mode.PRACTICE;
    private static _run: Run;
    public static init(mode: number = 0) {
        Settings._run = new Run();
        Settings._mode = mode;

        let pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
        new Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new Piece("S", [7, 8, 11, 12], 2, 0x00FF00), new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];

        Settings._config = new Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32, 191, 115], 100, 10, 7);
        Settings._pieceEditor = new PieceEditor(Settings._config.width, pieces);

        Drag.init();

        let settings: HTMLElement = document.createElement("div");
        settings.style.border = "1px solid black";

        let title: HTMLElement = document.createElement("H1");
        title.innerText = "Settings";

        settings.appendChild(title);

        let widthText: HTMLElement = document.createElement("label");
        widthText.innerText = "Width: " + Settings._config.width.toString();

        settings.appendChild(widthText);

        settings.appendChild(document.createElement("br"));

        Settings._widthSlider = <HTMLInputElement>document.createElement("input");
        Settings._widthSlider.setAttribute("type", "range");
        Settings._widthSlider.setAttribute("min", MIN_FIELD_WIDTH.toString());
        Settings._widthSlider.setAttribute("max", MAX_FIELD_WIDTH.toString());
        Settings._widthSlider.setAttribute("value", "10");

        Settings._widthSlider.oninput = function () {
            if (!isNaN(Number(Settings._widthSlider.value))) {
                let temp = Settings._config.width
                Settings._config.width = Number(Settings._widthSlider.value);
                try {
                    Settings._pieceEditor.setWidth(Settings._config.width);
                }
                catch (err) {
                    alert(err);
                    Settings._config.width = temp;
                }
                widthText.innerText = "Width: " + Settings._config.width.toString();
            }
        }

        settings.appendChild(Settings._widthSlider);

        let controlsTitle: HTMLElement = document.createElement("H2");
        controlsTitle.innerText = "Controls:";

        settings.appendChild(controlsTitle);

        let controlTable: HTMLElement = document.createElement("table")
        const labels = ["Right", "Soft Drop", "Left", "CW", "CCW", "180", "Hold", "Hard Drop", "Instant Drop", "Restart"];
        let controlsBox: HTMLElement[] = [];
        let row: HTMLElement;
        for (let i = 0; i < labels.length; ++i) {
            if (i % 4 === 0) {
                row = document.createElement("tr");
                row.setAttribute("align", "left");
                controlTable.appendChild(row);
            }
            let item: HTMLElement = document.createElement("td");
            item.innerText = labels[i];
            let numcontain: HTMLElement = document.createElement("td");
            let numberbox: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            numberbox.setAttribute("type", "number");
            numberbox.readOnly = true;
            numberbox.setAttribute("value", Settings._config.controls[i].toString());
            numberbox.onkeydown = function (event) {
                if (event.keyCode !== 27) {
                    numberbox.value = event.keyCode.toString();
                    Settings._config.controls[i] = event.keyCode;
                }
                numberbox.blur();
            }
            numcontain.appendChild(numberbox);
            controlsBox.push(numberbox);
            row.appendChild(item);
            row.appendChild(numcontain);
        }

        settings.appendChild(controlTable);


        let delayText: HTMLElement = document.createElement("label");
        delayText.innerText = "Delay: ";

        settings.appendChild(delayText);

        let delay: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        delay.setAttribute("type", "number");
        delay.setAttribute("min", "1");
        delay.setAttribute("value", Settings._config.delay.toString());

        delay.oninput = function () {
            if (!isNaN(Number(delay.value))) {
                Settings._config.delay = Number(delay.value);
            }
        }

        settings.appendChild(delay);

        let repeatText: HTMLElement = document.createElement("label");
        repeatText.innerText = "Repeat: ";

        settings.appendChild(repeatText);

        let repeat: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        repeat.setAttribute("type", "number");
        repeat.setAttribute("min", "1");
        repeat.setAttribute("value", Settings._config.repeat.toString());


        repeat.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                Settings._config.repeat = Number(repeat.value);
            }
        }

        settings.appendChild(repeat);

        let bagText: HTMLElement = document.createElement("label");
        bagText.innerText = "Bag: ";

        settings.appendChild(bagText);

        let bag: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        bag.setAttribute("type", "number");
        bag.setAttribute("min", "0");
        bag.setAttribute("value", Settings._config.bagSize.toString());

        bag.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                Settings._config.bagSize = Number(bag.value);
            }
        }

        settings.appendChild(bag);

        settings.appendChild(document.createElement("hr"));

        settings.appendChild(Settings._pieceEditor.getDiv());

        let apply: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        apply.innerText = "Apply Settings"
        apply.onclick = function () {
            Settings._config.pieces = Settings._pieceEditor.getPieces();
            Settings.restartGame();
            Settings.saveCookie();
        }

        settings.appendChild(apply);

        document.body.appendChild(settings);

        ////////////////////////
        //END DOM MINIPULATION//
        ////////////////////////

        if (document.cookie !== "") {
            Settings.readCookie();

            for (let i = 0; i < controlsBox.length; ++i) {
                controlsBox[i].setAttribute("value", Settings._config.controls[i].toString());
            }
            delay.setAttribute("value", Settings._config.delay.toString());
            repeat.setAttribute("value", Settings._config.repeat.toString());
        }
        else {
            Settings.saveCookie();
        }

        if (mode == 1) {
            Settings.loadMap();
        }
        Settings._run.afterLoad = () => {
            Settings.restartGame();
        };
        Settings._run.init();
    }

    private static restartGame() {
        Settings._run.startGame(Settings._config, Settings._mode, Settings._mapData);
    }

    private static readCookie() {
        let vals = decodeURIComponent(document.cookie).split(";");

        vals = vals.filter(function (el) { return el; });
        //Check verison
        try {
            for (let v of vals) {
                if (v != null && v.length > 2) {
                    switch (v.charAt(0)) {
                        case 'v':
                            if (parseFloat(v.substring(2)) < VERSION) {
                                if (confirm("Outdated Config version: " + v.substring(2) + " Latest: " + VERSION + "\n Press OK to reset to new config, cancel to keep old config (may have unexpected results)")) {
                                    this.saveCookie();
                                }
                            }
                            break;
                        case 'p':
                            if (Settings._mode == 1) {
                                let p = Config.pieceFromText(v.substring(2));
                                Settings._config.pieces = p;
                                Settings._pieceEditor.setPieces(p);
                            }
                            break;
                        case 'b':
                            if (Settings._mode == 1) {
                                Settings._config.bagSize = JSON.parse(v.substring(2));
                            }
                            break;
                        case 'c':
                            Settings._config.controls = JSON.parse(v.substring(2));
                            break;
                        case 'r':
                            Settings._config.repeat = JSON.parse(v.substring(2));
                            break;
                        case 'd':
                            Settings._config.delay = JSON.parse(v.substring(2));
                            break;
                    }
                }
            }
        }
        catch (err) {
            alert("Corrupted cookies: " + err.message);
            this.saveCookie();
        }

    }
    private static saveCookie() { //If no cookie
        let c = "";
        //Cookie format:
        //Version: ?; pieces; controls; delay; rate; bagsize;
        c += "v=" + VERSION.toString() + ";";
        if (Settings._mode != 1) {
            c += "p=" + JSON.stringify(Settings._config.pieces) + ";";

        }
        c += "c=" + JSON.stringify(Settings._config.controls) + ";";
        c += "r=" + JSON.stringify(Settings._config.repeat) + ";";
        c += "d=" + JSON.stringify(Settings._config.delay) + ';';
        if (Settings._mode != 1) {
            c += "b=" + JSON.stringify(Settings._config.bagSize) + ";";
        }
        c += "Expires: 2147483647;"
        document.cookie = encodeURIComponent(c);
    }

    private static loadMap(): void {
        Settings._widthSlider.disabled = true;
        Settings._pieceEditor.disable(true);
        let m = window.location.search.substring(1);
        let cfg: string[] = m.split("&");
        let w = toNumber(cfg[0]);
        let pc: Piece[] = [];
        let rawp: string[] = cfg[1].match(/.{1,11}/g);
        for (let r of rawp) {
            let shape: number[] = [];
            let i = 0;
            let sss = binaryFrom64(r.substring(1, 6));
            for (let s of sss.substring(5).split('')) {
                if (Number(s) == 1) {
                    shape.push(i);
                }
                i++;
            }
            pc.push(new Piece(r.substring(0, 1), shape, toNumber(r.substring(6, 7)), Number("0x" + hexFrom64(r.substring(7)).padStart(6, '0'))));
        }

        let queue: number[] = [];
        for (let q of cfg[2].split('')) {
            queue.push(toNumber(q));
        }
        let map: number[] = [];
        let rawmap: string = binaryFrom64(cfg[3]);
        rawmap = rawmap.substring(rawmap.length - w * FIELD_HEIGHT);
        let i = 0;
        for (let r of rawmap.split('')) {
            if (Number(r) == 1) {
                map.push(i);
            }
            i++;
        }

        Settings._mapData = new MapData(w, pc, queue, map, []);
    }
}



