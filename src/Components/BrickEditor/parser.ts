import { BrickFace, BrickModel, Vec3 } from 'types';

export function parseFace(face: string, separator: string): BrickFace {
    const parsed = face.split(separator).map((vertex) => {
        const s = vertex.trim().split(/\s+/);

        const triplet = s.map((number) => parseInt(number));
        console.log(s, triplet);

        if (triplet.length !== 3 || triplet.some((number) => isNaN(number))) {
            console.error(`Invalid vertex: ${vertex}`);
            return [NaN, NaN, NaN] as Vec3;
        }

        return triplet as Vec3;
    });

    if (parsed.every((vertex) => vertex.every((number) => isNaN(number)))) {
        return [];
    }

    return parsed as Vec3[];
}

export function isValidModel(model?: BrickModel): boolean {
    if (!model) return false;
    return model.every(isValidFace);
}

export function isValidFace(face: BrickFace): boolean {
    return (
        face.length >= 3 &&
        face.every((vertex) => vertex.length === 3 && vertex.every((number) => !isNaN(number)))
    );
}

export function serializeFace(face: BrickFace): string {
    return face.map((point) => point.join(' ')).join(' / ');
}

export function serializeModel(model: BrickModel): string[] {
    return model.map(serializeFace);
}
