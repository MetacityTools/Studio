import { Pickable } from '@bananagl/bananagl';

export function snapVertices(model: Pickable, snapDistance: number) {
    const processedIdx = new Set<number>();

    const attribute = model.attributes.getAttribute('position');
    if (!attribute) return;

    const vertices = attribute.buffer.getView(Float32Array) as Float32Array;
    const BVH = model.BVH;

    if (!vertices || !BVH) return;

    for (let i = 0; i < vertices.length; i += 3) {
        if (processedIdx.has(i)) continue;
        const vertex = vertices.subarray(i, i + 3);
        const neighbors = BVH.pointsInDistance(vertex, snapDistance);

        if (neighbors.length > 1) {
            const avg = neighbors.reduce(
                (acc, idx) => {
                    acc[0] += vertices[idx];
                    acc[1] += vertices[idx + 1];
                    acc[2] += vertices[idx + 2];
                    return acc;
                },
                [0, 0, 0]
            );

            avg[0] /= neighbors.length;
            avg[1] /= neighbors.length;
            avg[2] /= neighbors.length;

            neighbors.forEach((idx) => {
                vertices[idx] = avg[0];
                vertices[idx + 1] = avg[1];
                vertices[idx + 2] = avg[2];
                processedIdx.add(idx);
            });

            neighbors.forEach((idx) => {
                processedIdx.add(idx);
            });
        }
        processedIdx.add(i);

        if (processedIdx.size % 1000 === 0)
            console.log(`Processed ${processedIdx.size} vertices out of ${vertices.length / 3}`);
    }

    attribute.buffer.toUpdate();
}
