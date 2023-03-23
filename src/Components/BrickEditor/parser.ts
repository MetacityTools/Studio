import { BrickFace, BrickModel, Vec3 } from 'types';

export function parseModelString(modelString: string): BrickModel | undefined {
    const faces = modelString
        .replace(/[\s\n]+/g, '') // Remove whitespace and newlines
        .split(/},\s*{/) // Split string into faces
        .map((face) => face.replace(/[{}]/g, '')); // Remove curly brackets

    const result: BrickModel = [];

    for (const face of faces) {
        const vertices = face
            .split(/],\s*\[/) // Split string into vertices
            .map((vertex) => vertex.replace(/[\[\]]/g, '')); // Remove square brackets

        const faceTriplets: Vec3[] = [];

        for (const vertex of vertices) {
            const triplet: number[] = vertex
                .split(',') // Split string into numbers
                .map((number) => parseInt(number, 10)); // Convert strings to integers

            const lengthcheck = triplet.length !== 3;
            const nancheck = triplet.some((number) => isNaN(number));

            if (lengthcheck || nancheck) {
                console.error(`Invalid vertex: ${vertex}`);
                return undefined;
            }

            faceTriplets.push(triplet as Vec3);
        }

        result.push(faceTriplets);
    }

    return result;
}

function vertexJoiner(vertex: Vec3) {
    return `[${vertex.join(',')}]`;
}
function faceJoiner(face: Vec3[]) {
    return `{${face.map(vertexJoiner).join(',')}}`;
}

export function serializeModel(model: Vec3[][]): string {
    return model.map(faceJoiner).join(',\n');
}

export function parseFace(face: string, separator: string): BrickFace {
    const parsed = face.split(separator).map((vertex) => {
        const triplet = vertex
            .trim()
            .split(/\s*/)
            .map((number) => parseInt(number));

        if (triplet.length !== 3 || triplet.some((number) => isNaN(number))) {
            console.error(`Invalid vertex: ${vertex}`);
            return [NaN, NaN, NaN];
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
