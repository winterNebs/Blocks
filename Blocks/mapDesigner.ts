namespace M {
    export class MapEditor {
        private _mapDiv: HTMLDivElement = document.createElement("div");
        private _mapTable: HTMLElement = document.createElement("table")
        private _blocks: HTMLInputElement[] = [];
        private _width: number = 12;
        public constructor() {
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
            this._mapDiv.appendChild(this._mapTable);
        }


        public getDiv(): HTMLDivElement {
            return this._mapDiv;
        }

        public setWidth(width: number): void {
            this._width = width;
        }
    }
    function init() {
        ///
    }
    init();
}