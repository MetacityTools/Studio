const SIZE = 0.5;

export function unitQuad() {
    return new Float32Array([
        -SIZE,
        -SIZE,
        0,
        SIZE,
        -SIZE,
        0,
        SIZE,
        SIZE,
        0,
        -SIZE,
        -SIZE,
        0,
        SIZE,
        SIZE,
        0,
        -SIZE,
        SIZE,
        0,
    ]);
}
