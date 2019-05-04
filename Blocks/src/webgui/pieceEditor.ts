
import { Piece } from "../game/logic/piece";
import { Checkbox } from "./simplifiedHTML/bettercb";

export class PieceEditor {
    private _pieceDiv: HTMLDivElement = <HTMLDivElement>document.createElement("div");
    private _pieces: Piece[] = [];
    private _width: number = 12;
    private _pieceSelect: HTMLSelectElement = <HTMLSelectElement>document.createElement("select");
    private _checks: Checkbox[] = [];
    private _pieceNameInput: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    private _pieceColor: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    private _offsetSlider: HTMLInputElement = <HTMLInputElement>document.createElement("input");
    private _offsetText: HTMLElement = document.createElement("label");
    private _addPiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");
    private _removePiece: HTMLButtonElement = <HTMLButtonElement>document.createElement("button");


    public constructor(width: number = 12, pieces: Piece[] = [new Piece("T", [7, 11, 12, 13], 2, 0xFF00FF), new Piece("L", [8, 11, 12, 13], 2, 0xFF9900), new Piece("J", [6, 11, 12, 13], 2, 0x0000FF),
    new Piece("Z", [6, 7, 12, 13], 2, 0xFF0000), new Piece("S", [7, 8, 11, 12], 2, 0x00FF00), new Piece("I", [11, 12, 13, 14], 2, 0x00FFFF), new Piece("O", [12, 13, 17, 18], 2, 0xFFFF00)]) {
        this._width = width;
        this._pieces = pieces;

        this._pieceSelect.onchange = this.displayPiece.bind(this);

        this._pieceDiv.appendChild(this._pieceSelect);


        this._addPiece.innerText = "Apply Piece Settings"
        this._addPiece.onclick = this.addPieceClick.bind(this);
        this._pieceDiv.appendChild(this._addPiece);

        this._removePiece.innerText = "Remove Piece"
        this._removePiece.onclick = this.removePieceClick.bind(this);

        this._pieceDiv.appendChild(this._removePiece);


        let editorTable: HTMLElement = document.createElement("table")
        let row1: HTMLElement;
        for (let i = 0; i < 25; ++i) {
            if (i % 5 === 0) {
                row1 = document.createElement("tr");
                editorTable.appendChild(row1);
            }
            let check = new Checkbox();
            this._checks.push(check);
            row1.appendChild(check.getTD());
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



        this.updateList();
        this.displayPiece();
    }

    private removePieceClick() {
        if (this._pieces.length > 1) {
            this._pieces.splice(Number(this._pieceSelect.value), 1);
        }
        else {
            alert("Need at least one piece");
        }
        this.updateList();
        this.displayPiece();
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
                let val = this._pieceSelect.selectedIndex;
                if (val == this._pieceSelect.childElementCount - 1) {
                    this._pieces.push(new Piece(this._pieceNameInput.value, indices, this._offsetSlider.valueAsNumber, Number("0x" + this._pieceColor.value.substring(1))));
                }
                else {
                    this._pieces[val] = new Piece(this._pieceNameInput.value, indices, this._offsetSlider.valueAsNumber, Number("0x" + this._pieceColor.value.substring(1)));
                }
                this.updateList();
                this.displayPiece();
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
            p.innerText = i.toString() + ". \"" + this._pieces[i].name + "\"";
            this._pieceSelect.appendChild(p);
        }
        let n = document.createElement("option");
        n.value = this._pieceSelect.childElementCount.toString();
        n.innerText = "New Piece";
        this._pieceSelect.appendChild(n);
    }

    private displayPiece(): void {
        //Update current piece
        let val = this._pieceSelect.selectedIndex;
        if (val !== this._pieceSelect.childElementCount - 1) {
            //Update checks
            let shape = this._pieces[val].getRenderShape();
            for (let i = 0; i < 25; i++) {
                this._checks[i].checked = (shape[i] !== -1);
            }
            this._pieceNameInput.value = this._pieces[val].name;
            this._pieceColor.value = this.cth(this._pieces[val].color);
            this._offsetSlider.value = this._pieces[val].offset.toString();
            this.offsetUpdate();
        }

    }
    private cth(i: number): string {
        let hex = '000000'
        hex += i.toString(16);
        hex = hex.substring(hex.length - 6, hex.length);
        return "#" + hex;
    }
    public getDiv(): HTMLDivElement {
        return this._pieceDiv;
    }

    public setWidth(width: number): void {
        for (let i of this._pieces) {
            i.validateOffset(width);
        }
        this._width = width;
    }

    public getPieces(): Piece[] {
        return this._pieces;
    }
    public disable(state: boolean): void {
        this._pieceSelect.disabled = state;
        this._pieceNameInput.disabled = state;
        this._offsetSlider.disabled = state;
        this._pieceColor.disabled = state;
        for (let c of this._checks) {
            c.disabled = state;
        }
        this._addPiece.disabled = state;
        this._removePiece.disabled = state;
    }
    public setPieces(p: Piece[]) {
        this._pieces = p;
        for (let i of this._pieces) {
            i.validateOffset(this._width);
        }
        this.updateList();
        this.displayPiece();
    }
}