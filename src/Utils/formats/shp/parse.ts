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

import { ShapefileData, UserInputModel } from '@utils/types';

export async function parse(model: UserInputModel) {
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
            data: metadata,
            primitive: type,
        },
    };
}

function ringToSegments(ring: Coord[]) {
    const points = [];
    for (let i = 0; i < ring.length - 1; i++) {
        points.push(...ring[i], ...ring[i + 1]);
    }
    return new Float32Array(points);
}

function getBuffersAndMeta(features: FeatureCollection) {
    const buffers: Float32Array[] = [];
    const submodelIdx: number[] = [];
    let coordType: CoordType = 0;
    let metadata: { [submodel: number]: any } = {};
    let idx = 0;
    let type: 'point' | 'line' | 'triangle' | undefined;

    for (const feature of features.features) {
        const geometry = feature.geom;
        metadata[idx] = feature.properties;
        if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            if (type && type !== 'triangle') throw new Error('Mixed geometry types');
            type = 'triangle';
            const g = geometry as PolygonRecord;
            for (const ring of g.coords) {
                const triangles = triangulate(ring, g.coordType, true);
                buffers.push(triangles);
                submodelIdx.push(idx);
                coordType = g.coordType;
            }
        } else if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
            if (type && type !== 'line') throw new Error('Mixed geometry types');
            type = 'line';
            const g = geometry as PolyLineRecord;
            for (const ring of g.coords) {
                buffers.push(ringToSegments(ring));
                submodelIdx.push(idx);
                coordType = g.coordType;
            }
        } else if (geometry.type === 'Point') {
            if (type && type !== 'point') throw new Error('Mixed geometry types');
            type = 'point';

            const g = geometry as PointRecord;
            buffers.push(new Float32Array(g.coords));
            submodelIdx.push(idx);
            coordType = g.coordType;
        } else if (geometry.type === 'MultiPoint') {
            if (type && type !== 'point') throw new Error('Mixed geometry types');
            type = 'point';

            const g = geometry as MultiPointRecord;
            for (const coord of g.coords) {
                buffers.push(new Float32Array(coord));
                submodelIdx.push(idx);
                coordType = g.coordType;
            }
        }

        idx++;
    }
    return { buffers, submodelIdx, coordType, metadata, type };
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
            for (let i = 0; i < b.length; i += 2) {
                position[posoffset + i] = b[i];
                position[posoffset + i + 1] = b[i + 1];
                position[posoffset + i + 2] = 0;
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
