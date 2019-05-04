declare namespace ASC {
    const MAX_FIELD_WIDTH: number;
    const MIN_FIELD_WIDTH: number;
    const FIELD_HEIGHT: number;
    enum Rotations {
        NONE = 0,
        CW = 1,
        CWCW = 2,
        CCW = 3
    }
    enum Directions {
        UP = 0,
        RIGHT = 1,
        DOWN = 2,
        LEFT = 3
    }
    enum Inputs {
        RIGHT = 0,
        SD = 1,
        LEFT = 2,
        CW = 3,
        CCW = 4,
        CWCW = 5,
        HOLD = 6,
        HD = 7,
        SONIC = 8,
        RESTART = 9
    }
    enum State {
        ACTIVE = 0,
        PAUSED = 1,
        WIN = 2,
        LOSE = 3
    }
    enum Mode {
        PRACTICE = 0,
        MAP = 1,
        DIG = 2,
        VS = 3
    }
}
