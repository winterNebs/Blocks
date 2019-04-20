/// <reference path="pieceeditor.ts" />
namespace SETTINGS {

    export function init() {
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
                config._width = Number(widthSlider.value);
                pieceEditor.setWidth(config._width);
                widthText.innerText = "Width: " + config._width.toString();
            }
        }

        settings.appendChild(widthSlider);

        let controlsTitle: HTMLElement = document.createElement("H2");
        controlsTitle.innerText = "Controls:";

        settings.appendChild(controlsTitle);

        let controlTable: HTMLElement = document.createElement("table")
        const labels = ["Right", "Soft Drop", "Left", "CW", "CCW", "180", "Hold", "Hard Drop"];
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
            RUN.startGame(config);
        }

        settings.appendChild(apply);

        document.body.appendChild(settings);
    }
}
