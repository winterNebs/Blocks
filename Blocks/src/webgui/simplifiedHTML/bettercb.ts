﻿import { Drag } from "../dragutil";

    export class Checkbox {
        private static _lastState: boolean = false;
        private _checked: boolean = false;
        private _disabled: boolean = false;
        private _td: HTMLTableDataCellElement;
        public constructor(size: number = 16) {
            this._td = document.createElement("td");
            this._td.height = size.toString();
            this._td.width = size.toString();
            this._td.onmousemove = this.move.bind(this);
            this._td.ondragover = (ev) => (ev.preventDefault());
            this._td.onmousedown = (ev) => { this.click(); ev.preventDefault();};
            this._td.textContent = "";
            this._td.draggable = false;
            this.update();
        }
        
        public getTD(): HTMLTableDataCellElement {
            return this._td;
        }
        private update(): void {
            //Epic ternary 
            this._td.style.backgroundColor = this._disabled ? "#000000" : this._checked ? "#DDDDDD" : "#333333";
        }
        private click(): void {
            if (!this._disabled) {
                Checkbox._lastState = !this._checked;
                this._checked = Checkbox._lastState;
                this.update();

            }
        }
        private move(ev:MouseEvent): void {
            var style = getComputedStyle(this._td);
            if (!this._disabled && Drag.mouseDown) {
                this._checked = Checkbox._lastState;
            this.update();
            }
        }

        public get checked(): boolean {
            return this._checked;
        }
        public set checked(value:boolean) {
            this._checked = value;
            this.update();
        }

        public get disabled(): boolean {
            return this._disabled;
        }
        public set disabled(value: boolean) {
            this._disabled = value;
            this.update();
        }
    }
