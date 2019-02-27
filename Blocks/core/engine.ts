namespace TSE {

    export class Engine {

        private _canvas: HTMLCanvasElement;
        private _basicShader: BasicShader;
        private _projection: Matrix4x4;


        public constructor() {
        }

        public start(): void {

            this._canvas = GLUtillities.initialize();
            AssetManager.initialize();
            InputManager.initialize();

            gl.clearColor(0, 0, 0, 1);

            this._basicShader = new BasicShader();
            this._basicShader.use();


            //Load Materials 
            MaterialManager.registerMaterial(new Material("-1", "assets/textures/b.jpg", Color.red()));
           // MaterialManager.registerMaterial(new Material("g", "assets/textures/b.jpg", Color.green()));
           // MaterialManager.registerMaterial(new Material("b", "assets/textures/b.jpg", Color.blue()));


            let zoneID = ZoneManager.createFieldZone();
            //Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);

            ZoneManager.changeZone(zoneID);

            this.resize();
            this.loop();
        }
        /**REsizes the canvas to fit screen */
        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
            }
        }

        private loop(): void {
            MessageBus.update(0);

            ZoneManager.update(0);

            gl.clear(gl.COLOR_BUFFER_BIT);


            ZoneManager.render(this._basicShader);
            //Set uniforms
            let projectionPosition = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this));
        }

    }
}