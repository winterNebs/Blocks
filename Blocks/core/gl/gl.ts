namespace TSE {
    /**WebGL rendering Context */
    export var gl: WebGLRenderingContext;

    /**
     * Sets up WebGL rendering context*/
    export class GLUtillities {

        /**
         * Initializes WebGL, can use already assigned id 
         * @param elementId Id of element to search for 
         */
        public static initialize(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if (elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas") as HTMLCanvasElement;
                document.body.appendChild(canvas);
            }

            gl = canvas.getContext("webgl");

            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }

            return canvas;
        }
    }
}