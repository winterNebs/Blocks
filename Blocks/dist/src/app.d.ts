import { Config } from "./game/config/config";
import { Mode } from "./game/logic/enums";
import { MapData } from "./game/config/mapData";
export declare class Run {
    private _app;
    private _game;
    afterLoad: any;
    constructor();
    init(): void;
    startGame(config?: Config, mode?: Mode, mapdata?: MapData): void;
    load(): void;
}
