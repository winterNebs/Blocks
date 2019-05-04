export declare class RUN {
    app: PIXI.Application;
    private _game;
    afterLoad: any;
    constructor(mode: number);
    init(): void;
    startGame(config?: ASC.Config, mode?: ASC.Mode, mapdata?: ASC.MapData): void;
    load(): void;
}
