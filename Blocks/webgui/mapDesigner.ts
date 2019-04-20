/// <reference path="pieceeditor.ts" />
namespace M {
    export class MapEditor {
        private _mapDiv: HTMLDivElement = document.createElement("div");
        private _mapTable: HTMLElement = document.createElement("table")
        private _blocks: HTMLInputElement[] = [];
        private _width: number = 12;
        

        private _widthText: HTMLElement = document.createElement("label");
        private _widthSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");



        public constructor() {
            let table: HTMLTableElement = document.createElement("table");
            let row: HTMLTableRowElement = document.createElement("tr");
            let lefts: HTMLTableDataCellElement = document.createElement("td");
            let rights: HTMLTableDataCellElement = document.createElement("td");
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

            lefts.appendChild(this._mapTable);

            this._widthText.innerText = "Width: " + this._width.toString();

            rights.appendChild(this._widthText);

            rights.appendChild(document.createElement("br"));

            this._widthSlider.setAttribute("type", "range");
            this._widthSlider.setAttribute("min", ASC.MIN_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("max", ASC.MAX_FIELD_WIDTH.toString());
            this._widthSlider.setAttribute("value", "10");

            this._widthSlider.oninput = this.widthInput.bind(this);

            row.appendChild(lefts);
            row.appendChild(rights);
            table.appendChild(row);
            this._mapDiv.appendChild(table);

        }


        public getDiv(): HTMLDivElement {
            return this._mapDiv;
        }

        private widthInput() {
            if (!isNaN(Number(this._widthSlider.value))) {
                this._width = Number(this._widthSlider.value);
                this._widthText.innerText = "Width: " + this._width.toString();
            }

        }
    }
    export function init() {
        let map = new MapEditor();
        document.body.appendChild(map.getDiv());
    }
}