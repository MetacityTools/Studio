const TOP_NORMAL = [0, 0, -1];

function cross(a: number[], b: number[], out: number[]) {
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
}

function dot(a: number[], b: number[]) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v: number[]) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    v[0] /= length;
    v[1] /= length;
    v[2] /= length;
}

export function computeDots(positions: number[] | Float32Array) {
    const dots = new Float32Array(positions.length / 3);
    const v2 = [0, 0, 0];
    const v3 = [0, 0, 0];
    const n = [0, 0, 0];
    let d,
        c,
        j = 0;

    for (let i = 0; i < positions.length; i += 9) {
        v2[0] = positions[i + 3] - positions[i];
        v2[1] = positions[i + 4] - positions[i + 1];
        v2[2] = positions[i + 5] - positions[i + 2];
        v3[0] = positions[i + 6] - positions[i];
        v3[1] = positions[i + 7] - positions[i + 1];
        v3[2] = positions[i + 8] - positions[i + 2];

        cross(v2, v3, n);
        normalize(n);

        c = dot(n, TOP_NORMAL);
        d = Math.abs(c);
        dots[j++] = d;
        dots[j++] = d;
        dots[j++] = d;
    }

    return dots;
}
