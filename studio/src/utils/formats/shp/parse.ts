//worker to parse models
import {
    Coord,
    CoordType,
    FeatureCollection,
    FeatureReader,
    MultiPointRecord,
    PointRecord,
    PolyLineRecord,
    PolygonRecord,
    triangulate,
} from 'shpts';
import { BaseRecord } from 'shpts/dist/geometry/base';

import { ModelData, PrimitiveType, ShapefileData, UserInputModel } from '@data/types';

export async function parse(model: UserInputModel): Promise<ModelData> {
    const data = model.data as ShapefileData;

    if (!data.shp || !data.shx || !data.dbf)
        throw new Error(`Missing required files: ${model.name}`);
    const collection = await FeatureReader.fromArrayBuffers(data.shp, data.shx, data.dbf, data.cpg);
    const features = collection.readFeatureCollection();
    const { buffers, submodelIdx, coordType, metadata, type } = getBuffersAndMeta(features);
    const { position, submodel } = unifyBuffers(buffers, submodelIdx, coordType);

    return {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            name: model.name,
            primitive: type,
            data: metadata,
        },
    };
}

function getBuffersAndMeta(features: FeatureCollection) {
    const buffers: Float32Array[] = [];
    const submodelIdx: number[] = [];
    let metadata: { [submodel: number]: any } = {};
    let type: PrimitiveType | undefined = getType(features.features[0]?.geom.type);
    let coordType: CoordType = features.features[0]?.geom.coordType;
    let idx = 0;

    for (const feature of features.features) {
        const geometry = feature.geom;
        metadata[idx] = feature.properties;
        switch (geometry.type) {
            case 'Polygon':
            case 'MultiPolygon':
                processPolygons(geometry, buffers, submodelIdx, idx);
                break;
            case 'LineString':
            case 'MultiLineString':
                processLine(geometry, buffers, submodelIdx, idx);
                break;
            case 'Point':
                processPoint(geometry, buffers, submodelIdx, idx);
                break;
            case 'MultiPoint':
                processMultiPoint(geometry, buffers, submodelIdx, idx);
                break;
        }
        idx++;
    }

    return { buffers, submodelIdx, coordType, metadata, type };
}

function processMultiPoint(
    geometry: BaseRecord,
    buffers: Float32Array[],
    submodelIdx: number[],
    idx: number
) {
    const g = geometry as MultiPointRecord;
    for (const coord of g.coords) {
        buffers.push(new Float32Array(coord));
        submodelIdx.push(idx);
    }
}

function processPoint(
    geometry: BaseRecord,
    buffers: Float32Array[],
    submodelIdx: number[],
    idx: number
) {
    const g = geometry as PointRecord;
    buffers.push(new Float32Array(g.coords));
    submodelIdx.push(idx);
}

function processLine(
    geometry: BaseRecord,
    buffers: Float32Array[],
    submodelIdx: number[],
    idx: number
) {
    const g = geometry as PolyLineRecord;
    for (const ring of g.coords) {
        buffers.push(ringToSegments(ring));
        submodelIdx.push(idx);
    }
}

function processPolygons(
    geometry: BaseRecord,
    buffers: Float32Array[],
    submodelIdx: number[],
    idx: number
) {
    const g = geometry as PolygonRecord;
    for (const ring of g.coords) {
        const triangles = triangulate(ring, g.coordType, true);
        buffers.push(triangles);
        submodelIdx.push(idx);
    }
}

function ringToSegments(ring: Coord[]) {
    const points = [];
    for (let i = 0; i < ring.length - 1; i++) {
        points.push(...ring[i], ...ring[i + 1]);
    }
    return new Float32Array(points);
}

function getType(type: string) {
    switch (type) {
        case 'Polygon':
        case 'MultiPolygon':
            return PrimitiveType.TRIANGLES;
        case 'LineString':
        case 'MultiLineString':
            return PrimitiveType.LINES;
        case 'Point':
        case 'MultiPoint':
            return PrimitiveType.POINTS;
        default:
            return PrimitiveType.UNDEFINED;
    }
}

function unifyBuffers(buffers: Float32Array[], submodelIdx: number[], coordType: CoordType) {
    const coordCount = coordType === CoordType.XY ? 2 : 3;
    const icount = buffers.reduce((acc, b) => acc + b.length, 0) / coordCount;

    const needsPadding = coordType === CoordType.XY;
    const position = new Float32Array(icount * 3);
    const submodel = new Uint32Array(icount);

    let posoffset = 0;
    let suboffset = 0;

    for (let i = 0; i < buffers.length; i++) {
        const b = buffers[i];
        const s = submodelIdx[i];
        if (needsPadding) {
            for (let j = 0, k = 0; j < b.length; j += 2, k += 3) {
                position[posoffset + k] = b[j];
                position[posoffset + k + 1] = b[j + 1];
                position[posoffset + k + 2] = 0;
            }
            posoffset += (b.length / 2) * 3;
        } else {
            position.set(b, posoffset);
            posoffset += b.length;
        }

        for (let i = 0; i < b.length / coordCount; i++) submodel[suboffset + i] = s;

        suboffset += b.length / coordCount;
    }

    return { position, submodel };
}
