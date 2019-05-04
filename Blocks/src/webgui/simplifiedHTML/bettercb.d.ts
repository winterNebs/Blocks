declare namespace C {
    class Checkbox {
        private static _lastState;
        private _checked;
        private _disabled;
        private _td;
        constructor(size?: number);
        getTD(): HTMLTableDataCellElement;
        private update;
        private click;
        private move;
        checked: boolean;
        disabled: boolean;
    }
}
