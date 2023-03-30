import { GeometryData } from '../../components/Data';

export class SerializedGeometry {
    position: ArrayLike<number>;
    normal: ArrayLike<number>;
    expressID: ArrayLike<number>;
    index: ArrayLike<number>;
    groups: { start: number; count: number; materialIndex?: number }[];

    constructor(geometry: GeometryData) {
        this.position = geometry.position || [];
        this.normal = geometry.normal || [];
        this.expressID = geometry.expressID || [];
        this.index = geometry.index || [];
        this.groups = geometry.groups;
    }
}

export class GeometryReconstructor {
    static new(serialized: SerializedGeometry) {
        const geom = new GeometryData();
        if (serialized.expressID.length > 0) geom.expressID = new Uint32Array(serialized.expressID);
        if (serialized.position.length > 0) geom.position = new Float32Array(serialized.position);
        if (serialized.normal.length > 0) geom.normal = new Float32Array(serialized.normal);
        geom.setIndex(Array.from(serialized.index));
        geom.groups = serialized.groups;
        return geom;
    }
}
