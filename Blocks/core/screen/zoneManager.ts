namespace TSE {
    export class ZoneManager {

        private static _globalZoneID: number = -1;
        private static _zones: { [id: number]: Zone } = {};
        private static _activeZone: Zone;

        private constructor() { }

        public static createZone(name:string, descrption:string):number {
            ZoneManager._globalZoneID++;

            let zone = new Zone(ZoneManager._globalZoneID, name, descrption);
            ZoneManager._zones[ZoneManager._globalZoneID] = zone;

            return ZoneManager._globalZoneID;
        }

        public static createTestZone(): number {
            ZoneManager._globalZoneID++;
            let testZone = new TestZone(ZoneManager._globalZoneID, "test", "Simple test zone");
            ZoneManager._zones[ZoneManager._globalZoneID] = testZone;

            return ZoneManager._globalZoneID;
        }
        public static createFieldZone(width:number): number {
            ZoneManager._globalZoneID++;
            let testZone = new FieldZone(ZoneManager._globalZoneID, width, 32);
            ZoneManager._zones[ZoneManager._globalZoneID] = testZone;

            return ZoneManager._globalZoneID;
        }

        public static changeZone(id: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
            }

            if (ZoneManager._zones[id] !== undefined) {
                ZoneManager._activeZone = ZoneManager._zones[id];
                ZoneManager._zones[id].onActivated();
                ZoneManager._zones[id].load();
            }
        }

        public static update(time: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(time);
            }
        }

        public static render(shader: Shader): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        }

        public static getActive():Zone {
            return ZoneManager._activeZone;
        }
    }
}