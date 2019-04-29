namespace ASC {
    export const MAX_FIELD_WIDTH: number = 20;
    export const MIN_FIELD_WIDTH: number = 5;
    export const FIELD_HEIGHT: number = 25;
    export enum Rotations {
        NONE, CW, CWCW, CCW //Stored CW,CWCW, CCW but for math start at 1
    }
    export enum Directions {
        UP,RIGHT,DOWN,LEFT
    }
    export enum Inputs {
        RIGHT, SD, LEFT, CW, CCW, CWCW, HOLD, HD, SONIC, RESTART
    }
    export enum State {
        ACTIVE, PAUSED, WIN, LOSE
    }
    export enum Mode {
        PRACTICE, MAP, DIG, VS
    }
}