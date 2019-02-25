namespace TSE {
    /**Represents the info for a GLBuffer attribute */
    export class AttributeInfo {
        /**Location*/
        public location: number;
        /**Size (num of elements) (i.e vec3=3)*/
        public size: number;
        /**Number of elements from start of buffer */
        public offset: number;
    }
    /**Represents WebGL buffer */
    export class GLBuffer {

        private _hasAttributeLocation: boolean = false;
        private _elementSize: number;
        private _stride: number;
        private _buffer: WebGLBuffer;

        private _targetBufferType: number;
        private _dataType: number;
        private _mode: number;
        private _typeSize: number;

        private _data: number[] = [];
        private _attributes: AttributeInfo[] = [];
        /**
         * Creates new GL buffer
         * @param elementSize Size of each element
         * @param dataType Data type (Default: gl.FLOAT)
         * @param targetBufferType Buffer target type. Either: gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER. (Default: gl.ARRAY_BUFFER)
         * @param mode Drawing mode. Usually. gl.TRIANGLES or gl.LINES. (Default: gl.TRIANGLES)
         */
        public constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;

            // Determine byte size
            switch (this._dataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }

            this._stride = this._elementSize * this._typeSize;
            this._buffer = gl.createBuffer();
        }
        /**Destorys the buffer */
        public destroy(): void {
            gl.deleteBuffer(this._buffer);
        }
        /**
         * Binds this buffer
         * @param normalized indicates if datas should be normalized (Default:false)
         */
        public bind(normalized: boolean= false): void {
            gl.bindBuffer(this._targetBufferType, this._buffer);

            if (this._hasAttributeLocation) {
                for (let it of this._attributes) {
                    gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    gl.enableVertexAttribArray(it.location);
                }
            }
        }
        /**Unbinds this buffer */
        public unbind(): void {
            for (let it of this._attributes) {
                gl.disableVertexAttribArray(it.location);
            }
            gl.bindBuffer(this._targetBufferType, undefined);
        }

        /**
         * Adds attributes with the provided info
         * @param info The info to be added
         */
        public addAttributeLocation(info: AttributeInfo): void {
            this._hasAttributeLocation = true;
            this._attributes.push(info);
        }

        /**
         * Adds data to the buffer
         * @param data
         */
        public pushBackData(data: number[]): void {
            for (let d of data) {
                this._data.push(d);
            }
        }
        /**Uploads this buffer's data to the GPU */
        public upload(): void {
            gl.bindBuffer(this._targetBufferType, this._buffer);

            let bufferData: ArrayBuffer;
            switch (this._dataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }

            gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
        }

        /**Draws the buffer */
        public draw(): void {
            if (this._targetBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        }
    }
}