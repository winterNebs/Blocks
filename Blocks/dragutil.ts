namespace D {
    export class Drag {
        static mouseDown: boolean = false;
        static lastState: boolean = false;
        static lastSelected: HTMLInputElement;

        public static init(): void {
            document.body.onmousedown = function () {
                Drag.mouseDown = true;
            }
            document.body.onmouseup = function () {
                Drag.mouseDown = false;
            }
            document.body.onmouseleave = function () {
                Drag.mouseDown = false;
            }
        }
    }
}