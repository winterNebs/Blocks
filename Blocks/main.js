var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var engine;
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var TSE;
(function (TSE) {
    TSE.MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED";
    var AssetManager = /** @class */ (function () {
        function AssetManager() {
        }
        AssetManager.initialize = function () {
            AssetManager._loaders.push(new TSE.ImageAssetLoader());
        };
        AssetManager.registerLoader = function (loader) {
            AssetManager._loaders.push(loader);
        };
        AssetManager.onAssetLoaded = function (asset) {
            AssetManager._loadedAssets[asset.name] = asset;
            TSE.Message.send(TSE.MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
        };
        AssetManager.loadAsset = function (assetName) {
            var extension = assetName.split('.').pop().toLowerCase();
            for (var _i = 0, _a = AssetManager._loaders; _i < _a.length; _i++) {
                var l = _a[_i];
                if (l.supportedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension " + extension + " because no associated loader");
        };
        AssetManager.isAssetLoaded = function (assetName) {
            return AssetManager._loadedAssets[assetName] !== undefined;
        };
        AssetManager.getAsset = function (assetName) {
            if (AssetManager._loadedAssets[assetName] !== undefined) {
                return AssetManager._loadedAssets[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        };
        AssetManager._loaders = [];
        AssetManager._loadedAssets = {};
        return AssetManager;
    }());
    TSE.AssetManager = AssetManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ImageAsset = /** @class */ (function () {
        function ImageAsset(name, data) {
            this.name = name;
            this.data = data;
        }
        Object.defineProperty(ImageAsset.prototype, "width", {
            get: function () {
                return this.data.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageAsset.prototype, "height", {
            get: function () {
                return this.data.height;
            },
            enumerable: true,
            configurable: true
        });
        return ImageAsset;
    }());
    TSE.ImageAsset = ImageAsset;
    var ImageAssetLoader = /** @class */ (function () {
        function ImageAssetLoader() {
        }
        Object.defineProperty(ImageAssetLoader.prototype, "supportedExtensions", {
            get: function () {
                return ["png", "gif", "jpg"];
            },
            enumerable: true,
            configurable: true
        });
        ImageAssetLoader.prototype.loadAsset = function (assetName) {
            var image = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = assetName;
        };
        ImageAssetLoader.prototype.onImageLoaded = function (assetName, image) {
            console.log("onImageLoaded: assetName/image", assetName, image);
            var asset = new ImageAsset(assetName, image);
            TSE.AssetManager.onAssetLoaded(asset);
        };
        return ImageAssetLoader;
    }());
    TSE.ImageAssetLoader = ImageAssetLoader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BaseComponent = /** @class */ (function () {
        function BaseComponent(name) {
        }
        Object.defineProperty(BaseComponent.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: true,
            configurable: true
        });
        BaseComponent.prototype.setOwner = function (owner) {
            this._owner = owner;
        };
        BaseComponent.prototype.load = function () {
        };
        BaseComponent.prototype.update = function (time) {
        };
        BaseComponent.prototype.render = function (shader) {
        };
        return BaseComponent;
    }());
    TSE.BaseComponent = BaseComponent;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var SpriteComponent = /** @class */ (function (_super) {
        __extends(SpriteComponent, _super);
        function SpriteComponent(name, materialName, width, height) {
            if (width === void 0) { width = 10; }
            if (height === void 0) { height = 10; }
            var _this = _super.call(this, name) || this;
            _this._sprite = new TSE.Sprite(name, materialName, width, height);
            return _this;
        }
        SpriteComponent.prototype.load = function () {
            this._sprite.load();
        };
        SpriteComponent.prototype.render = function (shader) {
            this._sprite.draw(shader, this._owner.worldMatrix);
            _super.prototype.render.call(this, shader);
        };
        return SpriteComponent;
    }(TSE.BaseComponent));
    TSE.SpriteComponent = SpriteComponent;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Engine = /** @class */ (function () {
        function Engine() {
        }
        Engine.prototype.start = function () {
            this._canvas = TSE.GLUtillities.initialize();
            TSE.AssetManager.initialize();
            ASC.InputManager.initialize();
            TSE.gl.clearColor(0, 0, 0, 1);
            this._basicShader = new TSE.BasicShader();
            this._basicShader.use();
            //Load Materials 
            TSE.MaterialManager.registerMaterial(new TSE.Material("-1", "assets/textures/b.jpg", TSE.Color.red()));
            // MaterialManager.registerMaterial(new Material("g", "assets/textures/b.jpg", Color.green()));
            // MaterialManager.registerMaterial(new Material("b", "assets/textures/b.jpg", Color.blue()));
            var width = 12;
            var zoneID = TSE.ZoneManager.createFieldZone(width);
            //Load
            this._projection = TSE.Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
            TSE.ZoneManager.changeZone(zoneID);
            var field = new ASC.FieldManager(TSE.ZoneManager.getActive());
            var game = new ASC.Game(12, field);
            this.resize();
            this.loop();
        };
        /**REsizes the canvas to fit screen */
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                TSE.gl.viewport(0, 0, TSE.gl.canvas.width, TSE.gl.canvas.height);
                this._projection = TSE.Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);
            }
        };
        Engine.prototype.loop = function () {
            TSE.MessageBus.update(0);
            TSE.ZoneManager.update(0);
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            TSE.ZoneManager.render(this._basicShader);
            //Set uniforms
            var projectionPosition = this._basicShader.getUniformLocation("u_projection");
            TSE.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            requestAnimationFrame(this.loop.bind(this));
        };
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**
     * Sets up WebGL rendering context*/
    var GLUtillities = /** @class */ (function () {
        function GLUtillities() {
        }
        /**
         * Initializes WebGL, can use already assigned id
         * @param elementId Id of element to search for
         */
        GLUtillities.initialize = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find a canvas element named: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            TSE.gl = canvas.getContext("webgl");
            if (TSE.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtillities;
    }());
    TSE.GLUtillities = GLUtillities;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**Represents the info for a GLBuffer attribute */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    TSE.AttributeInfo = AttributeInfo;
    /**Represents WebGL buffer */
    var GLBuffer = /** @class */ (function () {
        /**
         * Creates new GL buffer
         * @param elementSize Size of each element
         * @param dataType Data type (Default: gl.FLOAT)
         * @param targetBufferType Buffer target type. Either: gl.ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER. (Default: gl.ARRAY_BUFFER)
         * @param mode Drawing mode. Usually. gl.TRIANGLES or gl.LINES. (Default: gl.TRIANGLES)
         */
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = TSE.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = TSE.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = TSE.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            // Determine byte size
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                case TSE.gl.INT:
                case TSE.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case TSE.gl.SHORT:
                case TSE.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case TSE.gl.BYTE:
                case TSE.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this._stride = this._elementSize * this._typeSize;
            this._buffer = TSE.gl.createBuffer();
        }
        /**Destorys the buffer */
        GLBuffer.prototype.destroy = function () {
            TSE.gl.deleteBuffer(this._buffer);
        };
        /**
         * Binds this buffer
         * @param normalized indicates if datas should be normalized (Default:false)
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var it = _a[_i];
                    TSE.gl.vertexAttribPointer(it.location, it.size, this._dataType, normalized, this._stride, it.offset * this._typeSize);
                    TSE.gl.enableVertexAttribArray(it.location);
                }
            }
        };
        /**Unbinds this buffer */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var it = _a[_i];
                TSE.gl.disableVertexAttribArray(it.location);
            }
            TSE.gl.bindBuffer(this._targetBufferType, undefined);
        };
        /**
         * Adds attributes with the provided info
         * @param info The info to be added
         */
        GLBuffer.prototype.addAttributeLocation = function (info) {
            this._hasAttributeLocation = true;
            this._attributes.push(info);
        };
        /**
         * Adds data to the buffer
         * @param data
         */
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var d = data_1[_i];
                this._data.push(d);
            }
        };
        /**Uploads this buffer's data to the GPU */
        GLBuffer.prototype.upload = function () {
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            var bufferData;
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case TSE.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case TSE.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case TSE.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            TSE.gl.bufferData(this._targetBufferType, bufferData, TSE.gl.STATIC_DRAW);
        };
        /**Draws the buffer */
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType === TSE.gl.ARRAY_BUFFER) {
                TSE.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === TSE.gl.ELEMENT_ARRAY_BUFFER) {
                TSE.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        return GLBuffer;
    }());
    TSE.GLBuffer = GLBuffer;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**WebGL shader */
    var Shader = /** @class */ (function () {
        /**
         * Creates a new shader
         * @param name name of shader
         * @param vertexSource source of vertex
         * @param fragmentSource source of fragment
         */
        function Shader(name) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
        }
        Object.defineProperty(Shader.prototype, "name", {
            /** Returns name of shader*/
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        /**Use this shader*/
        Shader.prototype.use = function () {
            TSE.gl.useProgram(this._program);
        };
        /**
         * Gets the location of an attirubte with the provided name
         * @param name Name of attribute to locate
         */
        Shader.prototype.getAttributeLocation = function (name) {
            if (this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named '" + this._name + "'");
            }
            return this._attributes[name];
        };
        /**
         * Gets the location of an uniform with the provided name
         * @param name Name of attribute to locate
         */
        Shader.prototype.getUniformLocation = function (name) {
            if (this._uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named '" + name + "' in shader named '" + this._name + "'");
            }
            return this._uniforms[name];
        };
        Shader.prototype.load = function (vertexSource, fragmentSource) {
            var vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = TSE.gl.createShader(shaderType);
            TSE.gl.shaderSource(shader, source);
            TSE.gl.compileShader(shader);
            var error = TSE.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader: '" + this._name + "' " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = TSE.gl.createProgram();
            TSE.gl.attachShader(this._program, vertexShader);
            TSE.gl.attachShader(this._program, fragmentShader);
            TSE.gl.linkProgram(this._program);
            var error = TSE.gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader: '" + this._name + "' " + error);
            }
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var info = TSE.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = TSE.gl.getAttribLocation(this._program, info.name);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var uniformCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; i++) {
                var info = TSE.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = TSE.gl.getUniformLocation(this._program, info.name);
            }
        };
        return Shader;
    }());
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var BasicShader = /** @class */ (function (_super) {
        __extends(BasicShader, _super);
        function BasicShader() {
            var _this = _super.call(this, "basic") || this;
            _this.load(_this.getVertexSource(), _this.getFragmentSource());
            return _this;
        }
        BasicShader.prototype.getVertexSource = function () {
            return "\nattribute vec3 a_position;\nattribute vec2 a_texCoord;\n\nuniform mat4 u_projection;\nuniform mat4 u_model;\n\nvarying vec2 v_texCoord;\n\nvoid main(){\n    gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n    v_texCoord = a_texCoord;\n}";
        };
        BasicShader.prototype.getFragmentSource = function () {
            return "\nprecision mediump float;\n\nuniform vec4 u_tint;\nuniform sampler2D u_diffuse;\n\nvarying vec2 v_texCoord;\n\nvoid main(){\n    gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);\n}";
        };
        return BasicShader;
    }(TSE.Shader));
    TSE.BasicShader = BasicShader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Color = /** @class */ (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 255; }
            if (g === void 0) { g = 255; }
            if (b === void 0) { b = 255; }
            if (a === void 0) { a = 255; }
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return this._r;
            },
            set: function (value) {
                this._r = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "rFloat", {
            get: function () {
                return this.r / 255.0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return this._g;
            },
            set: function (value) {
                this._g = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "gFloat", {
            get: function () {
                return this.g / 255.0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return this._b;
            },
            set: function (value) {
                this._b = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "bFloat", {
            get: function () {
                return this.b / 255.0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "a", {
            get: function () {
                return this._a;
            },
            set: function (value) {
                this._a = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "aFloat", {
            get: function () {
                return this.a / 255.0;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.toArray = function () {
            return [this.r, this._g, this._b, this._a];
        };
        Color.prototype.toFloatArray = function () {
            return [this.r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0];
        };
        Color.prototype.toFloat32Array = function () {
            return new Float32Array(this.toFloatArray());
        };
        Color.white = function () {
            return new Color(255, 255, 255, 255);
        };
        Color.black = function () {
            return new Color(0, 0, 0, 255);
        };
        Color.red = function () {
            return new Color(255, 0, 0, 255);
        };
        Color.green = function () {
            return new Color(0, 255, 0, 255);
        };
        Color.blue = function () {
            return new Color(0, 0, 255, 255);
        };
        return Color;
    }());
    TSE.Color = Color;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Material = /** @class */ (function () {
        function Material(name, diffuseTextureName, tint) {
            this._name = name;
            this._diffuseTextureName = diffuseTextureName;
            this._tint = tint;
            if (this._diffuseTextureName !== undefined) {
                this._diffuseTexture = TSE.TextureManager.getTexture(this._diffuseTextureName);
            }
        }
        Object.defineProperty(Material.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "tint", {
            get: function () {
                return this._tint;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "diffuseTexture", {
            get: function () {
                return this._diffuseTexture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "diffuseTextureName", {
            get: function () {
                return this._diffuseTextureName;
            },
            set: function (value) {
                if (this._diffuseTexture !== undefined) {
                    TSE.TextureManager.releaseTexture(this._diffuseTextureName);
                }
                this._diffuseTextureName = value;
                if (this._diffuseTextureName !== undefined) {
                    this._diffuseTexture = TSE.TextureManager.getTexture(this._diffuseTextureName);
                }
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.destroy = function () {
            TSE.TextureManager.releaseTexture(this._diffuseTextureName);
            this._diffuseTexture = undefined;
        };
        return Material;
    }());
    TSE.Material = Material;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MaterialReferenceNode = /** @class */ (function () {
        function MaterialReferenceNode(material) {
            this.referenceCount = 1;
            this.material = material;
        }
        return MaterialReferenceNode;
    }());
    var MaterialManager = /** @class */ (function () {
        function MaterialManager() {
        }
        MaterialManager.registerMaterial = function (material) {
            if (MaterialManager._materials[material.name] === undefined) {
                MaterialManager._materials[material.name] = new MaterialReferenceNode(material);
            }
        };
        MaterialManager.getMaterial = function (materialName) {
            if (MaterialManager._materials[materialName] === undefined) {
                return undefined;
            }
            else {
                MaterialManager._materials[materialName].referenceCount++;
                return MaterialManager._materials[materialName].material;
            }
        };
        MaterialManager.releaseMaterial = function (materialName) {
            if (MaterialManager._materials[materialName] === undefined) {
                console.warn(materialName + " cannot be release because it is not registered.");
            }
            else {
                MaterialManager._materials[materialName].referenceCount--;
                if (MaterialManager._materials[materialName].referenceCount < 1) {
                    MaterialManager._materials[materialName].material.destroy();
                    MaterialManager._materials[materialName].material = undefined;
                    delete MaterialManager._materials[materialName];
                }
            }
        };
        MaterialManager.registerColors = function (materialName, colors) {
            for (var i = 0; i < colors.length; ++i) {
                MaterialManager.registerMaterial(new TSE.Material(i.toString(), materialName, colors[i]));
            }
        };
        MaterialManager._materials = {};
        return MaterialManager;
    }());
    TSE.MaterialManager = MaterialManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Sprite = /** @class */ (function () {
        function Sprite(name, materialName, width, height) {
            if (width === void 0) { width = 10; }
            if (height === void 0) { height = 10; }
            this._name = name;
            this._width = width;
            this._height = height;
            this._materialName = materialName;
            this._material = TSE.MaterialManager.getMaterial(this._materialName);
        }
        Object.defineProperty(Sprite.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.destroy = function () {
            this._buffer.destroy();
            TSE.MaterialManager.releaseMaterial(this._materialName);
            this._material = undefined;
            this._materialName = undefined;
        };
        Sprite.prototype.load = function () {
            this._buffer = new TSE.GLBuffer(5);
            var positionAttribute = new TSE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            var textCoordAttribute = new TSE.AttributeInfo();
            textCoordAttribute.location = 1;
            textCoordAttribute.offset = 3;
            textCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(textCoordAttribute);
            var verticies = [
                //x,y,z , u , v
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
            ];
            this._buffer.pushBackData(verticies);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.draw = function (shader, model) {
            var modelLocation = shader.getUniformLocation("u_model");
            TSE.gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());
            var colorLocation = shader.getUniformLocation("u_tint");
            TSE.gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());
            if (this._material.diffuseTexture !== undefined) {
                this._material.diffuseTexture.activateAndBind(0);
                var diffuseLocation = shader.getUniformLocation("u_diffuse");
                TSE.gl.uniform1i(diffuseLocation, 0);
            }
            this._buffer.bind();
            this._buffer.draw();
        };
        Sprite.prototype.setMaterial = function (mat) {
            TSE.MaterialManager.releaseMaterial(this._materialName);
            this._materialName = mat;
            this._material = TSE.MaterialManager.getMaterial(mat);
        };
        return Sprite;
    }());
    TSE.Sprite = Sprite;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var LEVEL = 0;
    var BORDER = 0;
    var TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255]);
    var Texture = /** @class */ (function () {
        function Texture(name, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            this._isLoaded = false;
            this._name = name;
            this._width = width;
            this._height = height;
            this._handle = TSE.gl.createTexture();
            TSE.Message.subscribe(TSE.MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);
            this.bind();
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, 1, 1, BORDER, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);
            var asset = TSE.AssetManager.getAsset(this.name);
            if (asset !== undefined) {
                this.loadTextureFromAsset(asset);
            }
        }
        Object.defineProperty(Texture.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Texture.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Texture.prototype.destroy = function () {
            TSE.gl.deleteTexture(this._handle);
        };
        Texture.prototype.activateAndBind = function (textureUnit) {
            if (textureUnit === void 0) { textureUnit = 0; }
            TSE.gl.activeTexture(TSE.gl.TEXTURE0 + textureUnit);
        };
        Texture.prototype.bind = function () {
            TSE.gl.bindTexture(TSE.gl.TEXTURE_2D, this._handle);
        };
        Texture.prototype.unbind = function () {
            TSE.gl.bindTexture(TSE.gl.TEXTURE_2D, undefined);
        };
        Texture.prototype.onMessage = function (message) {
            if (message.code === TSE.MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
                this.loadTextureFromAsset(message.context);
            }
        };
        Texture.prototype.loadTextureFromAsset = function (asset) {
            this._width = asset.width;
            this._height = asset.height;
            this.bind();
            TSE.gl.texImage2D(TSE.gl.TEXTURE_2D, LEVEL, TSE.gl.RGBA, TSE.gl.RGBA, TSE.gl.UNSIGNED_BYTE, asset.data);
            if (this.isPowerof2()) {
                TSE.gl.generateMipmap(TSE.gl.TEXTURE_2D);
            }
            else { // Do not generate mip map and clamp wrapping to edge.
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_S, TSE.gl.CLAMP_TO_EDGE);
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_WRAP_T, TSE.gl.CLAMP_TO_EDGE);
                TSE.gl.texParameteri(TSE.gl.TEXTURE_2D, TSE.gl.TEXTURE_MIN_FILTER, TSE.gl.LINEAR);
            }
            this._isLoaded = true;
        };
        Texture.prototype.isPowerof2 = function () {
            return (this.isValuePowerof2(this._width) && this.isValuePowerof2(this._height));
        };
        Texture.prototype.isValuePowerof2 = function (value) {
            return (value & (value - 1)) == 0;
        };
        return Texture;
    }());
    TSE.Texture = Texture;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var TextureReferenceNode = /** @class */ (function () {
        function TextureReferenceNode(texture) {
            this.referenceCount = 1;
            this.texture = texture;
        }
        return TextureReferenceNode;
    }());
    var TextureManager = /** @class */ (function () {
        function TextureManager() {
        }
        TextureManager.getTexture = function (textureName) {
            if (TextureManager._textures[textureName] === undefined) {
                var texture = new TSE.Texture(textureName);
                TextureManager._textures[textureName] = new TextureReferenceNode(texture);
            }
            else {
                TextureManager._textures[textureName].referenceCount++;
            }
            return TextureManager._textures[textureName].texture;
        };
        TextureManager.releaseTexture = function (textureName) {
            if (TextureManager._textures[textureName] === undefined) {
                console.warn("A texture named " + textureName + " does not exist, and cannot be release.");
            }
            else {
                TextureManager._textures[textureName].referenceCount--;
                if (TextureManager._textures[textureName].referenceCount < 1) {
                    TextureManager._textures[textureName].texture.destroy();
                    TextureManager._textures[textureName] = undefined;
                    delete TextureManager._textures[textureName];
                }
            }
        };
        TextureManager._textures = {};
        return TextureManager;
    }());
    TSE.TextureManager = TextureManager;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Matrix4x4 = /** @class */ (function () {
        function Matrix4x4() {
            this._data = [];
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        Object.defineProperty(Matrix4x4.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Matrix4x4.identity = function () {
            return new Matrix4x4();
        };
        Matrix4x4.orthographic = function (left, right, bottom, top, nearClip, farClip) {
            var m = new Matrix4x4();
            var lr = 1.0 / (left - right);
            var bt = 1.0 / (bottom - top);
            var nf = 1.0 / (nearClip - farClip);
            m._data[0] = -2.0 * lr;
            m._data[5] = -2.0 * bt;
            m._data[10] = 2.0 * nf;
            m._data[12] = (left + right) * lr;
            m._data[13] = (top + bottom) * bt;
            m._data[14] = (farClip + nearClip) * nf;
            return m;
        };
        Matrix4x4.translation = function (position) {
            var m = new Matrix4x4();
            m._data[12] = position.x;
            m._data[13] = position.y;
            m._data[14] = position.z;
            return m;
        };
        /**
 * Creates a rotation matrix on the X axis from the provided angle in radians.
 * @param angleInRadians The angle in radians.
 */
        Matrix4x4.rotationX = function (angleInRadians) {
            var m = new Matrix4x4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[5] = c;
            m._data[6] = s;
            m._data[9] = -s;
            m._data[10] = c;
            return m;
        };
        /**
         * Creates a rotation matrix on the Y axis from the provided angle in radians.
         * @param angleInRadians The angle in radians.
         */
        Matrix4x4.rotationY = function (angleInRadians) {
            var m = new Matrix4x4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[0] = c;
            m._data[2] = -s;
            m._data[8] = s;
            m._data[10] = c;
            return m;
        };
        /**
         * Creates a rotation matrix on the Z axis from the provided angle in radians.
         * @param angleInRadians The angle in radians.
         */
        Matrix4x4.rotationZ = function (angleInRadians) {
            var m = new Matrix4x4();
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            m._data[0] = c;
            m._data[1] = s;
            m._data[4] = -s;
            m._data[5] = c;
            return m;
        };
        /**
         * Creates a rotation matrix from the provided angles in radians.
         * @param xRadians The angle in radians on the X axis.
         * @param yRadians The angle in radians on the Y axis.
         * @param zRadians The angle in radians on the Z axis.
         */
        Matrix4x4.rotationXYZ = function (xRadians, yRadians, zRadians) {
            var rx = Matrix4x4.rotationX(xRadians);
            var ry = Matrix4x4.rotationY(yRadians);
            var rz = Matrix4x4.rotationZ(zRadians);
            // ZYX
            return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
        };
        Matrix4x4.scale = function (scale) {
            var m = new Matrix4x4();
            m._data[0] = scale.x;
            m._data[5] = scale.y;
            m._data[10] = scale.z;
            return m;
        };
        Matrix4x4.multiply = function (a, b) {
            var m = new Matrix4x4();
            var b00 = b._data[0 * 4 + 0];
            var b01 = b._data[0 * 4 + 1];
            var b02 = b._data[0 * 4 + 2];
            var b03 = b._data[0 * 4 + 3];
            var b10 = b._data[1 * 4 + 0];
            var b11 = b._data[1 * 4 + 1];
            var b12 = b._data[1 * 4 + 2];
            var b13 = b._data[1 * 4 + 3];
            var b20 = b._data[2 * 4 + 0];
            var b21 = b._data[2 * 4 + 1];
            var b22 = b._data[2 * 4 + 2];
            var b23 = b._data[2 * 4 + 3];
            var b30 = b._data[3 * 4 + 0];
            var b31 = b._data[3 * 4 + 1];
            var b32 = b._data[3 * 4 + 2];
            var b33 = b._data[3 * 4 + 3];
            var a00 = a._data[0 * 4 + 0];
            var a01 = a._data[0 * 4 + 1];
            var a02 = a._data[0 * 4 + 2];
            var a03 = a._data[0 * 4 + 3];
            var a10 = a._data[1 * 4 + 0];
            var a11 = a._data[1 * 4 + 1];
            var a12 = a._data[1 * 4 + 2];
            var a13 = a._data[1 * 4 + 3];
            var a20 = a._data[2 * 4 + 0];
            var a21 = a._data[2 * 4 + 1];
            var a22 = a._data[2 * 4 + 2];
            var a23 = a._data[2 * 4 + 3];
            var a30 = a._data[3 * 4 + 0];
            var a31 = a._data[3 * 4 + 1];
            var a32 = a._data[3 * 4 + 2];
            var a33 = a._data[3 * 4 + 3];
            m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
            return m;
        };
        Matrix4x4.prototype.toFloat32Array = function () {
            return new Float32Array(this._data);
        };
        Matrix4x4.prototype.copyFrom = function (m) {
            for (var i = 0; i < 16; ++i) {
                this._data[i] = m._data[i];
            }
        };
        return Matrix4x4;
    }());
    TSE.Matrix4x4 = Matrix4x4;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Transform = /** @class */ (function () {
        function Transform() {
            this.position = TSE.Vector3.zero;
            this.rotation = TSE.Vector3.zero;
            this.scale = TSE.Vector3.one;
        }
        Transform.prototype.copyFrom = function (transform) {
            this.position.copyFrom(transform.position);
            this.rotation.copyFrom(transform.rotation);
            this.scale.copyFrom(transform.scale);
        };
        Transform.prototype.getTransformationMatrix = function () {
            var translation = TSE.Matrix4x4.translation(this.position);
            var rotation = TSE.Matrix4x4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
            var scale = TSE.Matrix4x4.scale(this.scale);
            // T * R * S
            return TSE.Matrix4x4.multiply(TSE.Matrix4x4.multiply(translation, rotation), scale);
        };
        return Transform;
    }());
    TSE.Transform = Transform;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vector2 = /** @class */ (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._x = x;
            this._y = y;
        }
        Object.defineProperty(Vector2.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.toArray = function () {
            return [this._x, this._y];
        };
        Vector2.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vector2;
    }());
    TSE.Vector2 = Vector2;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vector3 = /** @class */ (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this._x = x;
            this._y = y;
            this._z = z;
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3, "zero", {
            get: function () {
                return new Vector3();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3, "one", {
            get: function () {
                return new Vector3(1, 1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Vector3.prototype.toArray = function () {
            return [this._x, this._y, this._z];
        };
        Vector3.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        Vector3.prototype.copyFrom = function (vector) {
            this._x = vector._x;
            this._y = vector._y;
            this._z = vector._z;
        };
        return Vector3;
    }());
    TSE.Vector3 = Vector3;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessagePriority;
    (function (MessagePriority) {
        MessagePriority[MessagePriority["NORMAL"] = 0] = "NORMAL";
        MessagePriority[MessagePriority["HIGH"] = 1] = "HIGH";
    })(MessagePriority = TSE.MessagePriority || (TSE.MessagePriority = {}));
    var Message = /** @class */ (function () {
        function Message(code, sender, context, priority) {
            if (priority === void 0) { priority = MessagePriority.NORMAL; }
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }
        Message.send = function (code, sender, context) {
            TSE.MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
        };
        Message.sendPriority = function (code, sender, context) {
            TSE.MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        };
        Message.subscribe = function (code, handler) {
            TSE.MessageBus.addSubscription(code, handler);
        };
        Message.unsubscribe = function (code, handler) {
            TSE.MessageBus.removeSubscription(code, handler);
        };
        return Message;
    }());
    TSE.Message = Message;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessageBus = /** @class */ (function () {
        function MessageBus() {
        }
        MessageBus.addSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                MessageBus._subscriptions[code] = [];
            }
            if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ". Subscription not added.");
            }
            else {
                MessageBus._subscriptions[code].push(handler);
            }
        };
        MessageBus.removeSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                console.warn("Cannopt unsubscribe code: " + code + ". Not subscribed");
                return;
            }
            var nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus._subscriptions[code].splice(nodeIndex, 1);
            }
        };
        MessageBus.post = function (message) {
            console.log("Message posted:" + message);
            var handlers = MessageBus._subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var h = handlers_1[_i];
                if (message.priority === TSE.MessagePriority.HIGH) {
                    h.onMessage(message);
                }
                else {
                    MessageBus._normalMessageQueue.push(new TSE.MessageSubscriptionNode(message, h));
                }
            }
        };
        MessageBus.update = function (time) {
            if (MessageBus._normalMessageQueue.length === 0) {
                return;
            }
            var messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);
            for (var i = 0; i < messageLimit; i++) {
                var node = MessageBus._normalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        };
        MessageBus._subscriptions = {};
        MessageBus._normalQueueMessagePerUpdate = 10;
        MessageBus._normalMessageQueue = [];
        return MessageBus;
    }());
    TSE.MessageBus = MessageBus;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var MessageSubscriptionNode = /** @class */ (function () {
        function MessageSubscriptionNode(message, handler) {
            this.message = message;
            this.handler = handler;
        }
        return MessageSubscriptionNode;
    }());
    TSE.MessageSubscriptionNode = MessageSubscriptionNode;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ZoneState;
    (function (ZoneState) {
        ZoneState[ZoneState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
        ZoneState[ZoneState["LOADING"] = 1] = "LOADING";
        ZoneState[ZoneState["UPDATING"] = 2] = "UPDATING";
    })(ZoneState = TSE.ZoneState || (TSE.ZoneState = {}));
    var Zone = /** @class */ (function () {
        function Zone(id, name, description) {
            this._state = ZoneState.UNINITIALIZED;
            this._id = id;
            this._name = name;
            this._description = description;
            this._scene = new TSE.Scene();
        }
        Object.defineProperty(Zone.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "description", {
            get: function () {
                return this._description;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "scene", {
            get: function () {
                return this._scene;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.load = function () {
            this._state = ZoneState.LOADING;
            this._scene.load();
            this._state = ZoneState.UPDATING;
        };
        Zone.prototype.unload = function () {
        };
        Zone.prototype.update = function (time) {
            if (this._state === ZoneState.UPDATING) {
                this._scene.update(time);
            }
        };
        Zone.prototype.render = function (shader) {
            if (this._state === ZoneState.UPDATING) {
                this._scene.render(shader);
            }
        };
        Zone.prototype.onActivated = function () {
        };
        Zone.prototype.onDeactivated = function () {
        };
        return Zone;
    }());
    TSE.Zone = Zone;
})(TSE || (TSE = {}));
/// <reference path="zone.ts" />
var TSE;
(function (TSE) {
    var BlockComponent = /** @class */ (function (_super) {
        __extends(BlockComponent, _super);
        function BlockComponent(name, color, size) {
            if (color === void 0) { color = -1; }
            if (size === void 0) { size = 16; }
            return _super.call(this, name, color.toString(), size, size) || this;
        }
        return BlockComponent;
    }(TSE.SpriteComponent));
    var FieldZone = /** @class */ (function (_super) {
        __extends(FieldZone, _super);
        function FieldZone(id, width, resolution) {
            if (width === void 0) { width = 10; }
            if (resolution === void 0) { resolution = 16; }
            var _this = _super.call(this, id, "field", "Game Field") || this;
            _this._height = 25;
            _this._array = [];
            _this._width = width;
            _this._resolution = resolution;
            return _this;
        }
        FieldZone.prototype.initializeArray = function () {
            for (var i = 0; i < this._height * this._width; ++i) {
                var b = new TSE.SimObject(i + 2, "Block " + i.toString());
                b.addComponent(new BlockComponent(i.toString(), -1, this._resolution));
                b.transform.position.x = (i % this._width) * this._resolution;
                b.transform.position.y = (i / this._width >> 0) * this._resolution;
                this._array.push(b);
            }
        };
        FieldZone.prototype.load = function () {
            this._fieldObject = new TSE.SimObject(0, "field");
            this.initializeArray();
            for (var _i = 0, _a = this._array; _i < _a.length; _i++) {
                var b = _a[_i];
                this._fieldObject.addChild(b);
            }
            this.scene.addObject(this._fieldObject);
            _super.prototype.load.call(this);
        };
        FieldZone.prototype.update = function (time) {
            _super.prototype.update.call(this, time);
        };
        /**
         * Takes an array tuples to change [number, color]
         * @param Message array of [i, color]//color num for now
         */
        FieldZone.prototype.updateField = function (Message) {
            for (var _i = 0, Message_1 = Message; _i < Message_1.length; _i++) {
                var tuple = Message_1[_i];
                this._array[tuple[0]].swapComponent(0, new BlockComponent(tuple[0].toString(), tuple[1], this._resolution));
            }
        };
        return FieldZone;
    }(TSE.Zone));
    TSE.FieldZone = FieldZone;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Scene = /** @class */ (function () {
        function Scene() {
            this._root = new TSE.SimObject(0, "__ROOT__", this);
        }
        Object.defineProperty(Scene.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "isLoaded", {
            get: function () {
                return this._root.isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.addObject = function (object) {
            this._root.addChild(object);
        };
        Scene.prototype.getObjectByName = function (name) {
            return this._root.getObjectByName(name);
        };
        Scene.prototype.load = function () {
            this._root.load();
        };
        Scene.prototype.update = function (time) {
            this._root.update(time);
        };
        Scene.prototype.render = function (shader) {
            this._root.render(shader);
        };
        return Scene;
    }());
    TSE.Scene = Scene;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var SimObject = /** @class */ (function () {
        function SimObject(id, name, scene) {
            this._children = [];
            this._isLoaded = false;
            this._components = [];
            this._localMatrix = TSE.Matrix4x4.identity();
            this._worldMatrix = TSE.Matrix4x4.identity();
            this.transform = new TSE.Transform();
            this._id = id;
            this.name = name;
            this._scene = scene;
        }
        Object.defineProperty(SimObject.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "worldMatrix", {
            get: function () {
                return this._worldMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SimObject.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: true,
            configurable: true
        });
        SimObject.prototype.addChild = function (child) {
            child._parent = this;
            this._children.push(child);
            child.onAdded(this._scene);
        };
        SimObject.prototype.removeChild = function (child) {
            var index = this._children.indexOf(child);
            if (index !== -1) {
                child._parent = undefined;
                this._children.splice(index, 1);
            }
        };
        SimObject.prototype.getComponent = function (index) {
            return this._components[index];
        };
        SimObject.prototype.getObjectByName = function (name) {
            if (this.name === name) {
                return this;
            }
            for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                var child = _a[_i];
                var result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }
            return undefined;
        };
        SimObject.prototype.addComponent = function (component) {
            this._components.push(component);
            component.setOwner(this);
        };
        SimObject.prototype.removeComponent = function (index) {
            this.getComponent(index).setOwner(undefined);
            this._components.splice(index, 1);
        };
        SimObject.prototype.swapComponent = function (index, component) {
            this._components[index].setOwner(undefined);
            component.setOwner(this);
            component.load();
            this._components[index] = component;
        };
        SimObject.prototype.load = function () {
            this._isLoaded = true;
            for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
                var c = _a[_i];
                c.load();
            }
            for (var _b = 0, _c = this._children; _b < _c.length; _b++) {
                var c = _c[_b];
                c.load();
            }
        };
        SimObject.prototype.update = function (time) {
            this._localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this._parent !== undefined) ? this._parent._worldMatrix : undefined);
            for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
                var c = _a[_i];
                c.update(time);
            }
            for (var _b = 0, _c = this._children; _b < _c.length; _b++) {
                var c = _c[_b];
                c.update(time);
            }
        };
        SimObject.prototype.render = function (shader) {
            for (var _i = 0, _a = this._components; _i < _a.length; _i++) {
                var c = _a[_i];
                c.render(shader);
            }
            for (var _b = 0, _c = this._children; _b < _c.length; _b++) {
                var c = _c[_b];
                c.render(shader);
            }
        };
        SimObject.prototype.onAdded = function (scene) {
            this._scene = scene;
        };
        SimObject.prototype.updateWorldMatrix = function (parentWorldMatrix) {
            if (parentWorldMatrix !== undefined) {
                this._worldMatrix = TSE.Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
            }
            else {
                this._worldMatrix.copyFrom(this._localMatrix);
            }
        };
        return SimObject;
    }());
    TSE.SimObject = SimObject;
})(TSE || (TSE = {}));
/// <reference path="./zone.ts" />
var TSE;
(function (TSE) {
    var TestZone = /** @class */ (function (_super) {
        __extends(TestZone, _super);
        function TestZone() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestZone.prototype.load = function () {
            this._parentObject = new TSE.SimObject(0, "parentObject");
            this._parentSprite = new TSE.SpriteComponent("test", "g");
            this._parentObject.addComponent(this._parentSprite);
            this._parentObject.transform.position.x = 300;
            this._parentObject.transform.position.y = 300;
            //this._testObject = new SimObject(1, "testObject");
            //this._testSprite = new SpriteComponent("eee", "r");
            //this._testObject.addComponent(this._testSprite);
            //this._testObject.transform.position.x = 30;
            //this._testObject.transform.position.y = 30;
            //this._parentObject.addChild(this._testObject);
            this.scene.addObject(this._parentObject);
            _super.prototype.load.call(this);
        };
        TestZone.prototype.update = function (time) {
            this._parentObject.transform.rotation.z += 0.01;
            //this._testObject.transform.rotation.z += 0.01;
            _super.prototype.update.call(this, time);
        };
        return TestZone;
    }(TSE.Zone));
    TSE.TestZone = TestZone;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var ZoneManager = /** @class */ (function () {
        function ZoneManager() {
        }
        ZoneManager.createZone = function (name, descrption) {
            ZoneManager._globalZoneID++;
            var zone = new TSE.Zone(ZoneManager._globalZoneID, name, descrption);
            ZoneManager._zones[ZoneManager._globalZoneID] = zone;
            return ZoneManager._globalZoneID;
        };
        ZoneManager.createTestZone = function () {
            ZoneManager._globalZoneID++;
            var testZone = new TSE.TestZone(ZoneManager._globalZoneID, "test", "Simple test zone");
            ZoneManager._zones[ZoneManager._globalZoneID] = testZone;
            return ZoneManager._globalZoneID;
        };
        ZoneManager.createFieldZone = function (width) {
            ZoneManager._globalZoneID++;
            var testZone = new TSE.FieldZone(ZoneManager._globalZoneID, width, 32);
            ZoneManager._zones[ZoneManager._globalZoneID] = testZone;
            return ZoneManager._globalZoneID;
        };
        ZoneManager.changeZone = function (id) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
            }
            if (ZoneManager._zones[id] !== undefined) {
                ZoneManager._activeZone = ZoneManager._zones[id];
                ZoneManager._zones[id].onActivated();
                ZoneManager._zones[id].load();
            }
        };
        ZoneManager.update = function (time) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(time);
            }
        };
        ZoneManager.render = function (shader) {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        };
        ZoneManager.getActive = function () {
            return ZoneManager._activeZone;
        };
        ZoneManager._globalZoneID = -1;
        ZoneManager._zones = {};
        return ZoneManager;
    }());
    TSE.ZoneManager = ZoneManager;
})(TSE || (TSE = {}));
var ASC;
(function (ASC) {
    var Rotations;
    (function (Rotations) {
        Rotations[Rotations["CW"] = 0] = "CW";
        Rotations[Rotations["CWCW"] = 1] = "CWCW";
        Rotations[Rotations["CCW"] = 2] = "CCW";
    })(Rotations = ASC.Rotations || (ASC.Rotations = {}));
    var Directions;
    (function (Directions) {
        Directions[Directions["UP"] = 0] = "UP";
        Directions[Directions["RIGHT"] = 1] = "RIGHT";
        Directions[Directions["DOWN"] = 2] = "DOWN";
        Directions[Directions["LEFT"] = 3] = "LEFT";
    })(Directions = ASC.Directions || (ASC.Directions = {}));
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    ASC.MAX_FIELD_WIDTH = 20;
    ASC.MIN_FIELD_WIDTH = 5;
    ASC.FIELD_HEIGHT = 25;
    var Field = /** @class */ (function () {
        function Field(width) {
            this._array = [];
            this._width = width;
            this.initialize();
        }
        Field.prototype.initialize = function () {
            for (var i = 0; i < this._width * ASC.FIELD_HEIGHT; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        Field.prototype.shift = function (lines) {
            this._array.splice(0, lines * this._width);
            for (var i = 0; i < lines * this._width; ++i) {
                this._array.push(new ASC.Block());
            }
        };
        Field.prototype.getArray = function () {
            return this._array;
        };
        return Field;
    }());
    ASC.Field = Field;
})(ASC || (ASC = {}));
//find difference and interface with gui
var ASC;
(function (ASC) {
    var FieldManager = /** @class */ (function () {
        function FieldManager(fz) {
            this._colors = []; // get colors from bag system
            this._lastArray = [];
            this._fieldZone = fz;
            this.initialize();
        }
        FieldManager.prototype.initialize = function () {
            //hardcode color for now:
            //LIST OF COLOR? OR SET EACH BLOCK COLOR INDIVIDUALLY?
            this._colors.push(TSE.Color.black(), TSE.Color.red(), TSE.Color.green(), TSE.Color.blue());
            TSE.MaterialManager.registerColors("assets/textures/b.jpg", this._colors);
        };
        FieldManager.prototype.voidInitArray = function (newArr) {
            this._lastArray = newArr;
        };
        FieldManager.prototype.update = function (newArr) {
            var changes = [];
            for (var i = 0; i < this._lastArray.length; ++i) {
                console.log(JSON.stringify(this._lastArray[i].getColor()) + "," + JSON.stringify(newArr[i].getColor()));
                if (JSON.stringify(this._lastArray[i].getColor()) == JSON.stringify(newArr[i].getColor())) {
                    console.log(i);
                    changes.push([i, 1]); //hard code color for now
                }
            }
            //Need to check field size too
            this._lastArray = newArr;
            this._fieldZone.updateField(changes); // Use messenger? 
            //this._fieldZone.updateField([[this.x,1,2]])
        };
        return FieldManager;
    }());
    ASC.FieldManager = FieldManager;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Inputs;
    (function (Inputs) {
        Inputs[Inputs["RIGHT"] = 0] = "RIGHT";
        Inputs[Inputs["SD"] = 1] = "SD";
        Inputs[Inputs["LEFT"] = 2] = "LEFT";
        Inputs[Inputs["CW"] = 3] = "CW";
        Inputs[Inputs["CCW"] = 4] = "CCW";
        Inputs[Inputs["CWCW"] = 5] = "CWCW";
        Inputs[Inputs["HOLD"] = 6] = "HOLD";
        Inputs[Inputs["HD"] = 7] = "HD";
    })(Inputs || (Inputs = {}));
    var Game = /** @class */ (function () {
        function Game(width, manager) {
            if (width === void 0) { width = 12; }
            if (manager === void 0) { manager = null; }
            this._pieces = [];
            //Inputs for the game:
            //                            Right, SD,    Left,  CW,    CCW,   180(CWCW),Hold,HD     
            this._inputs = [false, false, false, false, false, false, false, false];
            ASC.InputManager.RegisterObserver(this);
            this._fieldManager = manager;
            if (width > ASC.MAX_FIELD_WIDTH || width < ASC.MIN_FIELD_WIDTH) {
                throw new Error("Invalid width: " + width.toString());
            }
            this._width = width;
            //For now:
            this._pieces.push(new ASC.Piece("T", [11, 12, 13, 14]));
            this._pieces.push(new ASC.Piece("L", [7, 12, 17, 18]));
            this._pieces.push(new ASC.Piece("Z", [11, 12, 17, 18]));
            this.resetGame();
            this._fieldManager.voidInitArray(this._field.getArray());
        }
        Game.prototype.resetGame = function () {
            this._field = new ASC.Field(this._width);
            this._queue = new ASC.Queue(Math.random() * Number.MAX_VALUE, this._pieces); //NO bag size for now
            this._hold = undefined;
            this._currentPiece = this._queue.getNext();
        };
        //TODO:
        //Get inputs for active piece
        //Collision detection on movement
        //Apply kicks and rotation (Piece needs offset function)
        //sad
        //Phases?:
        //Falling
        //Lock
        //Line clear function
        //Gravity event
        //Garbage Event
        Game.prototype.update = function () {
            var temp = this._field.getArray();
            for (var _i = 0, _a = this._currentPiece.getCoords(this._width); _i < _a.length; _i++) {
                var point = _a[_i];
                temp[point] = new ASC.Block(new TSE.Color(1, 1, 1, 1));
            }
            this._fieldManager.update(temp);
        };
        Game.prototype.RecieveNotification = function (keyevent, down) {
            switch (keyevent.keyCode) {
                case ASC.Keys.UP:
                    this._currentPiece.move(ASC.Directions.UP, 1);
                    this._inputs[Inputs.CW] = down;
                    break;
                case ASC.Keys.RIGHT:
                    this._currentPiece.move(ASC.Directions.RIGHT, 1);
                    this._inputs[Inputs.RIGHT] = down;
                    break;
                case ASC.Keys.DOWN:
                    this._currentPiece.move(ASC.Directions.DOWN, 1);
                    this._inputs[Inputs.SD] = down;
                    break;
                case ASC.Keys.LEFT:
                    this._inputs[Inputs.LEFT] = down;
                    this._currentPiece.move(ASC.Directions.LEFT, 1);
                    break;
                case ASC.Keys.S:
                    this._inputs[Inputs.CCW] = down;
                    break;
                case ASC.Keys.D:
                    this._inputs[Inputs.CWCW] = down;
                    break;
                case ASC.Keys.SPACE:
                    this._inputs[Inputs.HD] = down;
                    break;
                case ASC.Keys.SHIFT:
                    this._inputs[Inputs.HOLD] = down;
                    break;
            }
            this.update();
            //console.log(this._inputs);
        };
        return Game;
    }());
    ASC.Game = Game;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    //Don't think i need this anymore
    var GameState = /** @class */ (function () {
        function GameState() {
        }
        return GameState;
    }());
    ASC.GameState = GameState;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Keys;
    (function (Keys) {
        Keys[Keys["LEFT"] = 37] = "LEFT";
        Keys[Keys["UP"] = 38] = "UP";
        Keys[Keys["RIGHT"] = 39] = "RIGHT";
        Keys[Keys["DOWN"] = 40] = "DOWN";
        Keys[Keys["S"] = 83] = "S";
        Keys[Keys["D"] = 68] = "D";
        Keys[Keys["SPACE"] = 32] = "SPACE";
        Keys[Keys["SHIFT"] = 16] = "SHIFT";
    })(Keys = ASC.Keys || (ASC.Keys = {}));
    var InputManager = /** @class */ (function () {
        function InputManager() {
        }
        InputManager.initialize = function () {
            for (var i = 0; i < 255; ++i) {
                InputManager._keys[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
        };
        InputManager.isKeyDown = function (key) {
            return InputManager._keys[key];
        };
        InputManager.onKeyDown = function (event) {
            InputManager._keys[event.keyCode] = true;
            event.preventDefault();
            event.stopPropagation();
            InputManager.NotifyObservers(event, true);
            return false;
        };
        InputManager.onKeyUp = function (event) {
            InputManager._keys[event.keyCode] = false;
            event.preventDefault();
            event.stopPropagation();
            InputManager.NotifyObservers(event, false);
            return false;
        };
        InputManager.RegisterObserver = function (Observer) {
            InputManager._observers.push(Observer);
        };
        InputManager.UnregisterObserver = function (Observer) {
            var index = InputManager._observers.indexOf(Observer);
            if (index !== -1) {
                InputManager._observers.splice(index, 1);
            }
            else {
                console.warn("Cannot unregister observer.");
            }
        };
        InputManager.NotifyObservers = function (keyevent, down) {
            for (var _i = 0, _a = InputManager._observers; _i < _a.length; _i++) {
                var o = _a[_i];
                o.RecieveNotification(keyevent, down);
            }
        };
        InputManager._keys = [];
        InputManager._observers = [];
        return InputManager;
    }());
    ASC.InputManager = InputManager;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Piece = /** @class */ (function () {
        function Piece(name, shape, offset, initOrient, color) {
            if (offset === void 0) { offset = 0; }
            if (initOrient === void 0) { initOrient = 0; }
            if (color === void 0) { color = TSE.Color.red(); }
            this._shape = []; //The shape of piece (array of indecies to be filled)
            this._orientations = []; //Precomputed orientations/rotations
            this._currentOrientation = 0; //Current orientation
            this._x = 0;
            this._y = 0;
            this._name = name;
            this.setShape(shape);
            this._offset = offset;
            this._initialOrientation = initOrient;
            this._color = color;
            this._x += this._offset;
        }
        Piece.prototype.setShape = function (shape) {
            if (shape.length > 25 || shape.length < 1) {
                throw new Error("Invalid number of blocks");
            }
            this._blockCount = shape.length;
            for (var _i = 0, shape_1 = shape; _i < shape_1.length; _i++) {
                var i = shape_1[_i];
                if (i > 24 || i < 0) {
                    throw new Error("Block out of bounds");
                }
            }
            this._blockCount = shape.length;
            this._shape = shape;
            this._orientations.push(shape);
            var cw = [];
            var ccw = [];
            var cwcw = [];
            for (var _a = 0, shape_2 = shape; _a < shape_2.length; _a++) {
                var i = shape_2[_a];
                cw.push(20 - 5 * (i % 5) + (i / 5 << 0));
                ccw.push(4 + 5 * (i % 5) - (i / 5 << 0));
                cwcw.push(24 - i);
            }
            this._orientations.push(cw);
            this._orientations.push(cwcw);
            this._orientations.push(ccw);
        };
        Piece.prototype.rotate = function (dir) {
            this._currentOrientation = (this._currentOrientation + dir) % 4;
            // kicks
        };
        Piece.prototype.move = function (dir, dist) {
            switch (dir) {
                case ASC.Directions.UP:
                    this._y -= dist;
                    break;
                case ASC.Directions.RIGHT:
                    this._x += dist;
                    break;
                case ASC.Directions.DOWN:
                    this._y += dist;
                    break;
                case ASC.Directions.LEFT:
                    this._x -= dist;
                    break;
            }
        };
        Piece.prototype.getCoords = function (width) {
            var c = [];
            for (var _i = 0, _a = this._shape; _i < _a.length; _i++) {
                var i = _a[_i];
                c.push(i + this._x + this._y * width);
            }
            return c;
        };
        return Piece;
    }());
    ASC.Piece = Piece;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var PRNG = /** @class */ (function () {
        function PRNG(seed) {
            this._seed = Math.round(seed) % 2147483647;
            if (this._seed <= 0) {
                this._seed += 2147483646;
            }
        }
        /**
         * Returns a pseudo-random value between 1 and 2^32 - 2.
         */
        PRNG.prototype.next = function () {
            return this._seed = this._seed * 16807 % 2147483647;
        };
        /**
         * Returns a pseudo-random floating point number in range [0, 1).
         */
        PRNG.prototype.nextFloat = function () {
            // We know that result of next() will be 1 to 2147483646 (inclusive).
            return (this.next() - 1) / 2147483646;
        };
        PRNG.prototype.shuffleArray = function (array) {
            var _a;
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(this.nextFloat() * (i + 1));
                _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
            }
        };
        return PRNG;
    }());
    ASC.PRNG = PRNG;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    ASC.NUM_PREVIEWS = 6;
    var Queue = /** @class */ (function () {
        function Queue(seed, pieces, size) {
            if (size === void 0) { size = pieces.length; }
            this._queue = [];
            this._rng = new ASC.PRNG(seed);
            this._bag = pieces;
            this._bagSize = size;
            this.generateQueue();
        }
        Queue.prototype.generateQueue = function () {
            var tempBag = this._bag.slice(0);
            while (tempBag.length < this._bagSize) {
                tempBag.concat(this._bag.slice(0));
            }
            while (this._queue.length < ASC.NUM_PREVIEWS) {
                this._rng.shuffleArray(tempBag);
                Array.prototype.push.apply(this._queue, tempBag.slice(0, this._bagSize));
            }
        };
        Queue.prototype.getBag = function () {
            return this._queue.slice(0, ASC.NUM_PREVIEWS);
            ;
        };
        Queue.prototype.getNext = function () {
            var temp = this._queue.splice(0, 1)[0];
            this.generateQueue();
            return temp;
        };
        return Queue;
    }());
    ASC.Queue = Queue;
})(ASC || (ASC = {}));
var ASC;
(function (ASC) {
    var Block = /** @class */ (function () {
        function Block(color, solid, clearable) {
            if (color === void 0) { color = TSE.Color.black(); }
            if (solid === void 0) { solid = false; }
            if (clearable === void 0) { clearable = false; }
            this._color = color;
            this._solid = solid;
            this._clearable = clearable;
        }
        Block.prototype.getColor = function () {
            return this._color.toArray();
        };
        return Block;
    }());
    ASC.Block = Block;
})(ASC || (ASC = {}));
//# sourceMappingURL=main.js.map