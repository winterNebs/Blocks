//find difference and interface with gui
namespace ASC {

    export class FieldManager{

        private _colors: TSE.Color[]=[]; // get colors from bag system
        private _lastArray: Block[] = [];
        private _fieldZone: TSE.FieldZone;



        public constructor(fz: TSE.FieldZone) {
            this._fieldZone = fz;
            this.initialize();
        }

        private initialize():void {
            //hardcode color for now:

            //LIST OF COLOR? OR SET EACH BLOCK COLOR INDIVIDUALLY?
            this._colors.push(TSE.Color.black(), TSE.Color.red(), TSE.Color.green(), TSE.Color.blue());
            TSE.MaterialManager.registerColors("assets/textures/b.jpg", this._colors);
        }

        public voidInitArray(newArr: Block[]) {
            this._lastArray = newArr;
        }

        public update(newArr: Block[]): void {
            let changes: [number, number][] = [];
            for (let i = 0; i < this._lastArray.length; ++i) {
                console.log(JSON.stringify(this._lastArray[i].getColor()) + "," + JSON.stringify(newArr[i].getColor()));
                if (JSON.stringify(this._lastArray[i].getColor()) == JSON.stringify(newArr[i].getColor())) {
                    console.log(i);
                    changes.push([i, 1]); //hard code color for now
                }
            }
            //Need to check field size too
            this._lastArray = newArr;
            this._fieldZone.updateField(changes);// Use messenger? 
            //this._fieldZone.updateField([[this.x,1,2]])
        }
    }
}