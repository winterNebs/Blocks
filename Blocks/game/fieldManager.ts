//find difference and interface with gui
namespace ASC {

    export class FieldManager {


        private _colors: TSE.Color[]=[]; // get colors from bag system
        private _field: Field;
        private _lastArray: Block[] = [];

        private initialize():void {
            this._field = new Field(12);
            this._lastArray = this._field.getArray();
            //hardcode color for now:

            //LIST OF COLOR? OR SET EACH BLOCK COLOR INDIVIDUALLY?
            this._colors.push(TSE.Color.black(), TSE.Color.red(), TSE.Color.green(), TSE.Color.blue());
            TSE.MaterialManager.registerColors("assets/textures/b.jpg", this._colors);
        }
    }
}