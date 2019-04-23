/// <reference path="pieceeditor.ts" />
namespace SETTINGS {

    export function init(map: boolean = false) {
        //Can't change controls/ game breaks on apply ( for only one map specifically?? -> doesnt' seem to be issue with cookie since can save settings and load broken map)
        //Add rebindable restart
        //Add sonic drop
        //Fix last piece bug
        // ?? 

        let staticQueue: number[] = [];
        let mapShape: number[] = [];
        let pieces: ASC.Piece[] = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
        new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];

        let config: ASC.Config = new ASC.Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32], 100, 10, 7);
        let pieceEditor = new P.PieceEditor(config._width, pieces);
        D.Drag.init();
        let settings: HTMLElement = document.createElement("div");
        settings.style.border = "1px solid black";

        let title: HTMLElement = document.createElement("H1");
        title.innerText = "Settings";

        settings.appendChild(title);

        let widthText: HTMLElement = document.createElement("label");
        widthText.innerText = "Width: " + config._width.toString();

        settings.appendChild(widthText);

        settings.appendChild(document.createElement("br"));

        let widthSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        widthSlider.setAttribute("type", "range");
        widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
        widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
        widthSlider.setAttribute("value", "10");

        widthSlider.oninput = function () {
            if (!isNaN(Number(widthSlider.value))) {
                let temp = config._width
                config._width = Number(widthSlider.value);
                try {
                    pieceEditor.setWidth(config._width);
                }
                catch (err) {
                    alert(err);
                    config._width = temp;
                }
                widthText.innerText = "Width: " + config._width.toString();
            }
        }

        settings.appendChild(widthSlider);

        let controlsTitle: HTMLElement = document.createElement("H2");
        controlsTitle.innerText = "Controls:";

        settings.appendChild(controlsTitle);

        let controlTable: HTMLElement = document.createElement("table")
        const labels = ["Right", "Soft Drop", "Left", "CW", "CCW", "180", "Hold", "Hard Drop"];
        let controlsBox: HTMLElement[] = [];
        let row: HTMLElement;
        for (let i = 0; i < labels.length; ++i) {
            if (i % 4 === 0) {
                row = document.createElement("tr");
                controlTable.appendChild(row);
            }
            let item: HTMLElement = document.createElement("th");
            item.innerText = labels[i] + ": ";
            let numberbox: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            numberbox.setAttribute("type", "number");
            numberbox.readOnly = true;
            numberbox.setAttribute("value", config._controls[i].toString());
            numberbox.onkeydown = function (event) {
                if (event.keyCode !== 27) {
                    numberbox.value = event.keyCode.toString();
                    config._controls[i] = event.keyCode;
                }
                numberbox.blur();
            }
            item.appendChild(numberbox);
            controlsBox.push(numberbox);
            row.appendChild(item);
        }

        settings.appendChild(controlTable);


        let delayText: HTMLElement = document.createElement("label");
        delayText.innerText = "Delay: ";

        settings.appendChild(delayText);

        let delay: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        delay.setAttribute("type", "number");
        delay.setAttribute("min", "1");
        delay.setAttribute("value", config._delay.toString());

        delay.oninput = function () {
            if (!isNaN(Number(delay.value))) {
                config._delay = Number(delay.value);
            }
        }

        settings.appendChild(delay);

        let repeatText: HTMLElement = document.createElement("label");
        repeatText.innerText = "Repeat: ";

        settings.appendChild(repeatText);

        let repeat: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        repeat.setAttribute("type", "number");
        repeat.setAttribute("min", "1");
        repeat.setAttribute("value", config._repeat.toString());


        repeat.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                config._repeat = Number(repeat.value);
            }
        }

        settings.appendChild(repeat);

        let bagText: HTMLElement = document.createElement("label");
        bagText.innerText = "Bag: ";

        settings.appendChild(bagText);

        let bag: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        bag.setAttribute("type", "number");
        bag.setAttribute("min", "0");
        bag.setAttribute("value", config._bagSize.toString());

        bag.oninput = function () {
            if (!isNaN(Number(repeat.value))) {
                config._bagSize = Number(bag.value);
            }
        }

        settings.appendChild(bag);

        settings.appendChild(document.createElement("hr"));



        settings.appendChild(pieceEditor.getDiv());



        let apply: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        apply.innerText = "Apply Settings"
        apply.onclick = function () {
            config._pieces = pieceEditor.getPieces();
            RUN.startGame(config, map, staticQueue, mapShape);
            saveCookie();
        }

        settings.appendChild(apply);

        document.body.appendChild(settings);


        if (document.cookie !== "") {
            readCookie();

            for (let i = 0; i < controlsBox.length; ++i) {
                controlsBox[i].setAttribute("value", config._controls[i].toString());
            }
            delay.setAttribute("value", config._delay.toString());
            repeat.setAttribute("value", config._repeat.toString());
            RUN.afterLoad = () => (RUN.startGame(config, map, staticQueue, mapShape));
        }


        if (map) {
            widthSlider.disabled = true;
            pieceEditor.disable(true);
            let m = window.location.search.substring(1);
            let cfg: string[] = m.split("&");
            config._width = B.toNumber(cfg[0]);
            let pc: ASC.Piece[] = [];
            let rawp: string[] = cfg[1].match(/.{1,11}/g);
            for (let r of rawp) {
                let shape: number[] = [];
                let i = 0;
                let sss = B.binaryFrom64(r.substring(1, 6));
                for (let s of sss.substring(5).split('')) {
                    if (Number(s) == 1) {
                        shape.push(i);
                    }
                    i++;
                }
                pc.push(new ASC.Piece(r.substring(0, 1), shape, B.toNumber(r.substring(6, 7)), Number("0x" + B.hexFrom64(r.substring(7)).padStart(6, '0'))));
            }
            config._pieces = pc;
            let queue: number[] = [];
            for (let q of cfg[2].split('')) {
                queue.push(B.toNumber(q));
            }
            staticQueue = queue;
            let map: number[] = [];
            let rawmap: string = B.binaryFrom64(cfg[3]);
            rawmap = rawmap.substring(rawmap.length - config._width * ASC.FIELD_HEIGHT);
            let i = 0;
            for (let r of rawmap.split('')) {
                if (Number(r) == 1) {
                    map.push(i);
                }
                i++;
            }
            mapShape = map;
            RUN.afterLoad = () => (RUN.startGame(config, true, staticQueue, mapShape));

        }
        function saveCookie() { //If no cookie
            let c = "";
            //Cookie format:
            //Version: ?; pieces; controls; delay; rate; bagsize;
            c += "ver=0.001;";
            if (!map) {
                c += "p=" + JSON.stringify(config._pieces) + ";";

            }
            c += "c=" + JSON.stringify(config._controls) + ";";
            c += "r=" + JSON.stringify(config._repeat) + ";";
            c += "d=" + JSON.stringify(config._delay) + ';';
            if (!map) {
                c += "b=" + JSON.stringify(config._bagSize) + ";";
            }
            c += "Expires: 2147483647;"
            document.cookie = encodeURIComponent(c);
        }
        function readCookie() {
            let vals = decodeURIComponent(document.cookie).split(";");

            vals = vals.filter(function (el) { return el; });
            //Check verison
            try {
                for (let v of vals) {
                    if (v != null && v.length > 2) {
                        switch (v.charAt(0)) {
                            case 'p':
                                if (!map) {
                                    let p = ASC.Config.pieceFromText(v.substring(2));
                                    config._pieces = p;
                                    pieceEditor.setPieces(p);
                                }
                                break;
                            case 'b':
                                if (!map) {
                                    config._bagSize = JSON.parse(v.substring(2));
                                }
                                break;
                            case 'c':
                                config._controls = JSON.parse(v.substring(2));
                                break;
                            case 'r':
                                config._repeat = JSON.parse(v.substring(2));
                                break;
                            case 'd':
                                config._delay = JSON.parse(v.substring(2));
                                break;
                        }
                    }
                }
            }
            catch (err) {
                alert("Corrupted cookies: " + err.message);
            }
        }

    }
}
