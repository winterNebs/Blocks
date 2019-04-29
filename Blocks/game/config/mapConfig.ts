namespace ASC {
    //Useless? 
    export class MapConfig extends Config {
        private _map: MapData;
        public constructor(w: number, p: Piece[], c: number[], d: number, r: number, b: number, map: MapData) {
            super(w, p, c, d, r, b);
            this._map = map;
        }
    }
}