import { mat3, mat4, vec3 } from 'gl-matrix';

type Buffer = Float32Array;

//acts as IndexedGeometry as well as BufferGeometry
export class GeometryData {
    index_?: Uint32Array;
    expressID_?: Uint32Array;
    position_?: Buffer;
    normal_?: Buffer;
    groups: GeometryGroup[] = [];

    constructor() {}

    setIndex(index: Uint32Array | number[]): void {
        if (index instanceof Array) {
            this.index = new Uint32Array(index);
            return;
        } else if (index instanceof Uint32Array) {
            this.index = index;
            return;
        }
    }

    get index(): Uint32Array {
        if (!this.index_) throw new Error('Index not set');
        return this.index_;
    }

    set index(index: Uint32Array) {
        this.index_ = index;
    }

    get expressID(): Uint32Array {
        if (!this.expressID_) throw new Error('ExpressID not set');
        return this.expressID_;
    }

    set expressID(expressID: Uint32Array) {
        this.expressID_ = expressID;
    }

    get position(): Buffer {
        if (!this.position_) throw new Error('Position not set');
        return this.position_;
    }

    set position(position: Buffer) {
        this.position_ = position;
    }

    get normal(): Buffer {
        if (!this.normal_) throw new Error('Normal not set');
        return this.normal_;
    }

    set normal(normal: Buffer) {
        this.normal_ = normal;
    }

    dispose() {
        this.index_ = undefined;
        this.expressID_ = undefined;
        this.position_ = undefined;
        this.normal_ = undefined;
    }

    applyMatrix4(matrix: mat4) {
        const normalMatrix = mat3.fromMat4(mat3.create(), matrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        const tmp = vec3.create();

        for (let i = 0; i < this.position.length; i += 3) {
            vec3.transformMat4(tmp, this.position.subarray(i, i + 3), matrix);
            this.position.set(tmp, i);
        }

        for (let i = 0; i < this.normal.length; i += 3) {
            vec3.transformMat3(tmp, this.normal.subarray(i, i + 3), normalMatrix);
            this.normal.set(tmp, i);
        }
    }
}

export interface GeometryGroup {
    start: number;
    count: number;
    materialIndex?: number | undefined;
}

export enum Side {
    FrontSide = 0,
    BackSide = 1,
    DoubleSide = 2,
}

export class MaterialData {
    uuid: string;

    constructor(
        public color: [number, number, number],
        public opacity: number,
        public transparent: boolean
    ) {
        this.uuid =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
}

export class ContainerData {
    parent?: ContainerData;
    children: ContainerData[] = [];

    add(model: ModelData) {
        model.parent = this;
        this.children.push(model);
    }

    removeFromParent() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
                this.parent = undefined;
            } else {
                console.warn('Model not found in parent');
            }
        }
    }

    remove(model: ModelData) {
        const index = this.children.indexOf(model);
        if (index !== -1) {
            this.children.splice(index, 1);
            model.parent = undefined;
        } else {
            console.warn('Model not found in parent');
        }
    }
}

export class ModelData extends ContainerData {
    matrix = mat4.create();

    constructor(
        public geometry: GeometryData,
        public material: MaterialData | MaterialData[] = new MaterialData([1, 1, 1], 1, false)
    ) {
        super();
    }
}

export function mergeBufferGeometries(geometries: GeometryData[], useGroups = false): GeometryData {
    const mergedGeometry = new GeometryData();

    //compute lengths of each attribute
    const positionLengths = geometries.map((geometry) => geometry.position.length);
    const normalLengths = geometries.map((geometry) => geometry.normal.length);
    const indexLengths = geometries.map((geometry) => geometry.index.length);
    const expressIDLengths = geometries.map((geometry) => geometry.expressID.length);
    //assert all attributes have same length
    if (
        positionLengths.length !== normalLengths.length ||
        positionLengths.length !== expressIDLengths.length
    )
        throw new Error(
            `Attribute lengths do not match: pos:${positionLengths.length} norm:${normalLengths.length} idx:${expressIDLengths.length}`
        );

    for (let i = 0; i < positionLengths.length; i++) {
        if (
            positionLengths[i] !== normalLengths[i] ||
            positionLengths[i] !== expressIDLengths[i] * 3
        )
            throw new Error(
                `Attribute lengths do not match: pos:${positionLengths[i]} norm:${normalLengths[i]} idx:${expressIDLengths[i]} * 3`
            );
    }

    //merge and recompute indices
    const positions = new Float32Array(positionLengths.reduce((a, b) => a + b, 0));
    const normals = new Float32Array(normalLengths.reduce((a, b) => a + b, 0));
    const indices = new Uint32Array(indexLengths.reduce((a, b) => a + b, 0));
    const expressIDs = new Uint32Array(expressIDLengths.reduce((a, b) => a + b, 0));

    let poffset = 0;
    let noffset = 0;
    let ioffset = 0;
    let eoffset = 0;

    for (let i = 0; i < geometries.length; i++) {
        const geometry = geometries[i];
        positions.set(geometry.position, poffset);
        normals.set(geometry.normal, noffset);
        indices.set(geometry.index, ioffset);
        expressIDs.set(geometry.expressID, eoffset);

        const addIndex = poffset / 3;
        for (let j = 0; j < geometry.index.length; j++) {
            indices[ioffset + j] += addIndex;
        }

        if (useGroups) {
            mergedGeometry.groups.push({
                start: ioffset,
                count: geometry.index.length,
                materialIndex: i,
            });
        }

        poffset += geometry.position.length;
        noffset += geometry.normal.length;
        ioffset += geometry.index.length;
        eoffset += geometry.expressID.length;
    }

    mergedGeometry.position = positions;
    mergedGeometry.normal = normals;
    mergedGeometry.index = indices;
    mergedGeometry.expressID = expressIDs;

    return mergedGeometry;
}

export type tmat4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
