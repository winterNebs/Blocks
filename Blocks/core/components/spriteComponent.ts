namespace TSE {

    export class SpriteComponent extends BaseComponent{

        protected _sprite: Sprite; 

        public constructor(name: string, materialName:string, width:number = 10, height:number = 10) {
            super(name);
            this._sprite = new Sprite(name, materialName,width, height);
             
        }

        public load(): void {
            this._sprite.load();
        }
        public render(shader: Shader): void {
            this._sprite.draw(shader, this._owner.worldMatrix);
            super.render(shader);

        }
    }
}