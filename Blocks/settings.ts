namespace SETTINGS {

    function init() {
        let pieces: ASC.Piece[] = [new ASC.Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new ASC.Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new ASC.Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
        new ASC.Piece("Z", [11, 12, 17, 18], 2, 0xFF0000), new ASC.Piece("S", [12, 13, 16, 17], 2, 0x00FF00), new ASC.Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new ASC.Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)];
        let config: ASC.Config = new ASC.Config(12, pieces, [39, 40, 37, 38, 83, 68, 16, 32], 100, 10, 7);

        let settings: HTMLElement = document.createElement("div");
        settings.style.border = "1px solid black";

        let title: HTMLElement = document.createElement("H1");
        title.innerText = "Settings";

        settings.appendChild(title);

        let widthText: HTMLElement = document.createElement("label");
        widthText.innerText = "Width: " + config._width.toString();

        settings.appendChild(widthText);

        let widthSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        widthSlider.setAttribute("type", "range");
        widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
        widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
        widthSlider.setAttribute("value", "10");

        widthSlider.oninput = function () {
            if (!isNaN(Number(widthSlider.value))) {
                config._width = Number(widthSlider.value);
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

        let pieceDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");

        let pieceSelect: HTMLSelectElement = <HTMLSelectElement>document.createElement("select");
        updateList();
        function updateList() {
            while (pieceSelect.firstChild) {
                pieceSelect.removeChild(pieceSelect.lastChild);
            }
            for (let i = 0; i < pieces.length; ++i) {
                let p = document.createElement("option");
                p.value = i.toString();
                p.innerText = pieces[i].name;
                pieceSelect.appendChild(p);
            }
        }
        pieceDiv.appendChild(pieceSelect);

        let removePiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        removePiece.innerText = "Remove Piece"
        removePiece.onclick = function () {
            if (pieces.length > 1) {
                pieces.splice(Number(pieceSelect.value), 1);
            }
            else {
                alert("Need at least one piece");
            }
            updateList();
        }
        pieceDiv.appendChild(removePiece);



        settings.appendChild(document.createElement("hr"));
        let editorTable: HTMLElement = document.createElement("table")
        let row1: HTMLElement;
        let checks: HTMLInputElement[] = [];
        for (let i = 0; i < 25; ++i) {
            if (i % 5 === 0) {
                row1 = document.createElement("tr");
                editorTable.appendChild(row1);
            }
            let check: HTMLInputElement = document.createElement("input");
            check.setAttribute("type", "checkbox");
            checks.push(check);
            row1.appendChild(check);
        }

        pieceDiv.appendChild(editorTable);

        let pieceNameText: HTMLElement = document.createElement("label");
        pieceNameText.innerText = "Piece Name: ";

        pieceDiv.appendChild(pieceNameText);

        let pieceNameInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        pieceNameInput.setAttribute("type", "text");

        pieceDiv.appendChild(pieceNameInput);

        pieceDiv.appendChild(document.createElement("br"));

        let pieceColorText: HTMLElement = document.createElement("label");
        pieceColorText.innerText = "Piece Color (Chrome and Firefox will have color picker, other browsers enter in form #FFF000): ";

        pieceDiv.appendChild(pieceColorText);

        let pieceColor: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        pieceColor.setAttribute("type", "color");
        pieceColor.setAttribute("value", "#FFFFFF")

        pieceDiv.appendChild(pieceColor);

        pieceDiv.appendChild(document.createElement("br"));

        let offsetText: HTMLElement = document.createElement("label");
        offsetText.innerText = "Offset (where piece spawns): 0";

        pieceDiv.appendChild(offsetText);

        let offsetSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        offsetSlider.setAttribute("type", "range");
        offsetSlider.setAttribute("min", "0");
        offsetSlider.setAttribute("max", config._width.toString());
        offsetSlider.setAttribute("value", "0");
        offsetSlider.onchange = function (){
            offsetText.innerText = "Offset (where piece spawns): " + offsetSlider.value;
        }

        pieceDiv.appendChild(document.createElement("br"));

        pieceDiv.appendChild(offsetSlider);

        let addPiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        addPiece.innerText = "Add Piece"
        addPiece.onclick = function () {
            let indices: number[] = [];
            for (let i = 0; i < checks.length; ++i) {
                if (checks[i].checked) {
                    indices.push(i);
                }
            }
            if (indices.length > 0) {
                try {
                    pieces.push(new ASC.Piece(pieceNameInput.value, indices, offsetSlider.valueAsNumber, Number("0x" + pieceColor.value.substring(1))));
                    updateList();
                }
                catch (err) {
                    alert("Invalid Piece: " + err);
                }
            }
            else {
                alert("Need at least 1 block");
            }
        }
        pieceDiv.appendChild(addPiece);

        settings.appendChild(pieceDiv);

        let apply: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
        apply.innerText = "Apply Settings"
        apply.onclick = function () {
            startGame(config);
        }

        settings.appendChild(apply);

        document.body.appendChild(settings);
    }

    init();
}
