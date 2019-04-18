/// <reference path="dragutil.ts" />
namespace P {
    export class PieceEditor {
        private _pieceDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        private _pieces: ASC.Piece[] = [];
        private _width: number = 12;
        private _pieceSelect: HTMLSelectElement = <HTMLSelectElement>document.createElement("select");
        private _checks: HTMLInputElement[] = [];
        private _pieceNameInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        private _pieceColor: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        private _offsetSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");
        private _offsetText: HTMLElement = document.createElement("label");


        public constructor(width: number = 12, pieces: ASC.Piece[] = []) {
            this._width = width;
            this._pieces = pieces;
            this.updateList();

            this._pieceDiv.appendChild(this._pieceSelect);

            let removePiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            removePiece.innerText = "Remove Piece"
            removePiece.onclick = this.removePieceClick.bind(this);

            this._pieceDiv.appendChild(removePiece);

            let editorTable: HTMLElement = document.createElement("table")
            let row1: HTMLElement;
            for (let i = 0; i < 25; ++i) {
                if (i % 5 === 0) {
                    row1 = document.createElement("tr");
                    editorTable.appendChild(row1);
                }
                let check: HTMLInputElement = document.createElement("input");
                check.setAttribute("type", "checkbox");
                check.onmouseenter = function () {
                    if (D.Drag.mouseDown) {
                        check.checked = D.Drag.lastState;
                    }
                }
                check.onmousedown = function (ev) {
                    D.Drag.lastState = !check.checked;
                    D.Drag.lastSelected = check;
                    check.checked = D.Drag.lastState;
                    ev.preventDefault();
                }
                check.onmouseup = function (ev) {
                    if (D.Drag.lastSelected == check) {
                        check.checked = !check.checked;
                    }
                    ev.preventDefault();
                }
                check.ondragover = function (ev) {
                    ev.preventDefault();
                }
                this._checks.push(check);
                row1.appendChild(check);
            }

            this._pieceDiv.appendChild(editorTable);

            let pieceNameText: HTMLElement = document.createElement("label");
            pieceNameText.innerText = "Piece Name: ";

            this._pieceDiv.appendChild(pieceNameText);

            this._pieceNameInput.setAttribute("type", "text");

            this._pieceDiv.appendChild(this._pieceNameInput);

            this._pieceDiv.appendChild(document.createElement("br"));

            let pieceColorText: HTMLElement = document.createElement("label");
            pieceColorText.innerText = "Piece Color (Chrome and Firefox will have color picker, other browsers enter in form #FFF000): ";

            this._pieceDiv.appendChild(pieceColorText);

            this._pieceColor.setAttribute("type", "color");
            this._pieceColor.setAttribute("value", "#FFFFFF")

            this._pieceDiv.appendChild(this._pieceColor);

            this._pieceDiv.appendChild(document.createElement("br"));

            this._offsetText.innerText = "Offset (where piece spawns): 0";

            this._pieceDiv.appendChild(this._offsetText);

            this._offsetSlider.setAttribute("type", "range");
            this._offsetSlider.setAttribute("min", "0");
            this._offsetSlider.setAttribute("max", this._width.toString());
            this._offsetSlider.setAttribute("value", "0");
            this._offsetSlider.oninput = this.offsetUpdate.bind(this);

            this._pieceDiv.appendChild(document.createElement("br"));

            this._pieceDiv.appendChild(this._offsetSlider);

            let addPiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
            addPiece.innerText = "Add Piece"
            addPiece.onclick = this.addPieceClick.bind(this);
            this._pieceDiv.appendChild(addPiece);
        }

        private removePieceClick() {
            if (this._pieces.length > 1) {
                this._pieces.splice(Number(this._pieceSelect.value), 1);
            }
            else {
                alert("Need at least one piece");
            }
            this.updateList();
        }
        private addPieceClick() {
            let indices: number[] = [];
            for (let i = 0; i < this._checks.length; ++i) {
                if (this._checks[i].checked) {
                    indices.push(i);
                }
            }
            if (indices.length > 0) {
                try {
                    this._pieces.push(new ASC.Piece(this._pieceNameInput.value, indices, this._offsetSlider.valueAsNumber, Number("0x" + this._pieceColor.value.substring(1))));
                    this.updateList();
                }
                catch (err) {
                    alert("Invalid Piece: " + err);
                }
            }
            else {
                alert("Need at least 1 block");
            }
        }

        private offsetUpdate() {
            this._offsetText.innerText = "Offset (where piece spawns): " + this._offsetSlider.value;
        }

        private updateList() {
            while (this._pieceSelect.firstChild) {
                this._pieceSelect.removeChild(this._pieceSelect.lastChild);
            }
            for (let i = 0; i < this._pieces.length; ++i) {
                let p = document.createElement("option");
                p.value = i.toString();
                p.innerText = this._pieces[i].name;
                this._pieceSelect.appendChild(p);
            }
        }

       
        public getDiv(): HTMLDivElement {
            return this._pieceDiv;
        }

        public setWidth(width: number): void {
            this._width = width;
        }

        public getPieces(): ASC.Piece[] {
            return this._pieces;
        }
    }
}