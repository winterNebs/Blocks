/// <reference path="pieceeditor.ts" />
namespace M {
    export class MapEditor {
        private _mapDiv: HTMLDivElement = document.createElement("div");
        private _mapTable: HTMLElement = document.createElement("table")
        private _blocks: HTMLInputElement[] = [];
        private _width: number = 12;
        private _lefts: HTMLTableDataCellElement = document.createElement("td");

        private _widthText: HTMLElement = document.createElement("label");
        private _widthSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");

        private _pieceEditor: P.PieceEditor;

        private _queueInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        public constructor() {
            let table: HTMLTableElement = document.createElement("table");
            let row: HTMLTableRowElement = document.createElement("tr");
            let rights: HTMLTableDataCellElement = document.createElement("td");

            table.style.border = "1px solid black";


            let title: HTMLElement = document.createElement("H1");
            title.innerText = "Settings";

            rights.appendChild(title);
            this._widthText.innerText = "Width: " + this._width.toString();

            rights.appendChild(this._widthText);

            rights.appendChild(document.createElement("br"));

            this._widthSlider.setAttribute("type", "range");
            this._widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("value", this._width.toString());
            this._widthSlider.oninput = this.widthInput.bind(this);

            rights.appendChild(this._widthSlider);

            this._pieceEditor = new P.PieceEditor(this._width);
            rights.appendChild(this._pieceEditor.getDiv());

            let queueText: HTMLElement = document.createElement("label");
            queueText.innerText = "Enter Queue Using Piece Number (ie. \"1,2,0,1,3,3,3,3,3\"): ";

            rights.appendChild(queueText);

            this._queueInput.setAttribute("type", "text");

            rights.appendChild(this._queueInput);

            rights.appendChild(document.createElement("br"));

            let generateMap: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            generateMap.innerText = "Generate Map"
            generateMap.onclick = this.genMap.bind(this);
            rights.appendChild(generateMap);

            let resetField: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            resetField.innerText = "Reset Field"
            resetField.onclick = this.drawTable.bind(this);
            rights.appendChild(resetField);


            row.appendChild(this._lefts);
            row.appendChild(rights);

            table.appendChild(row);
            this._mapDiv.appendChild(table);


            this.drawTable();
        }


        public getDiv(): HTMLDivElement {
            return this._mapDiv;
        }

        private genMap() {

            if (this._pieceEditor.getPieces.length > 64) {
                alert("Too many pieces: Max 64");
                return;
            }
            if (!isNaN(Number(this._widthSlider.value))) {
                let temp = this._width
                this._width = Number(this._widthSlider.value);
                try {
                    this._pieceEditor.setWidth(this._width);
                }
                catch (err) {
                    alert(err);
                    this._width = temp;
                }
            }
            let output = "";
            // Store map info in the following format:
            //Width |&|Pieces <- ouch|&|Queue|&| Map
            //Width = Single base 64 character (5-20)
            //Pieces 10 chars {Name(1)|Shape(5)|offset(1)|Color(4)}
            //Queue = Numbers encoded into base 64
            //Map = Convert map into binary number (max length is 500 1's), then change to base 64 -> theoretically only 70ish chars

            //Width, 1 char
            output += B.fromNumber(this._width) + "&";

            //Piece, 11 char * n pieces 
            for (let p of this._pieceEditor.getPieces()) {
                output += B.pad(p.name, ' ', 1); //1  //PAD

                let b = "";
                for (let i of p.getRenderShape()) {
                    b += Number(i !== -1);
                }
                output += B.pad(B.binaryTo64(b), '0', 5); // 5 //PAD 
                output += B.fromNumber(p.offset); // 1
                output += B.pad(B.hexTo64(p.color.toString(16)), '0', 4); //4 //PAD (change these to pad start smh)

            }
            output += "&";
            //1 * n
            let queue: number[] = []
            try {
                queue = this._queueInput.value.split(',').map(Number);
                if (queue.length < 2) {
                    throw new Error("Not enough pieces in the queue!");
                }
                for (let i of queue) {
                    if (i >= this._pieceEditor.getPieces().length || i < 0) {
                        throw new Error("Invalid Queue");
                    }
                    output += B.fromNumber(i);;
                }
            }
            catch (err) {
                alert(err.message);
                return;
            }
            output += "&"

            let map: string = ""; //PAD 
            for (let i = 0; i < this._blocks.length; ++i) {
                map += (Number(this._blocks[i].checked));
            }
            //output += B.pad(B.binaryTo64(map), '0', Math.ceil((this._width * ASC.FIELD_HEIGHT) / 6));
            output += B.binaryTo64(map);
            output += "&"
            if (confirm("Go to map? (Yes to go, No outputs url)")) {
                window.open('/map.html?' + output);
            }
        }

        private widthInput() {
            if (!isNaN(Number(this._widthSlider.value))) {
                this._widthText.innerText = "Width: " + Number(this._widthSlider.value);
            }
        }
        private drawTable(): void {
            let temp = this._width;
            this._width = Number(this._widthSlider.value);
            try {
                this._pieceEditor.setWidth(this._width);
            }
            catch (err) {
                alert(err)
                this._width = temp;
            }

            for (var i = this._mapTable.children.length - 1; i >= 0; --i) {
                this._mapTable.removeChild(this._mapTable.children[i]);
            }
            this._blocks = [];
            let mapR: HTMLElement;
            for (let i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                if (i % this._width === 0) {
                    mapR = document.createElement("tr");
                    this._mapTable.appendChild(mapR);
                }
                let b: HTMLInputElement = document.createElement("input");
                b.setAttribute("type", "checkbox");
                b.onmouseenter = function () {
                    if (D.Drag.mouseDown) {
                        b.checked = D.Drag.lastState;
                    }
                }
                b.onmousedown = function (ev) {
                    D.Drag.lastState = !b.checked;
                    D.Drag.lastSelected = b;
                    b.checked = D.Drag.lastState;
                    ev.preventDefault();
                }
                b.onmouseup = function (ev) {
                    if (D.Drag.lastSelected == b) {
                        b.checked = !b.checked;
                    }
                    ev.preventDefault();
                }
                b.ondragover = function (ev) {
                    ev.preventDefault();
                    ev.preventDefault();
                }
                this._blocks.push(b);
                mapR.appendChild(b);
            }

            this._lefts.appendChild(this._mapTable);
        }
    }
    export function init() {
        D.Drag.init();
        let map = new MapEditor();
        document.body.appendChild(map.getDiv());
    }
}