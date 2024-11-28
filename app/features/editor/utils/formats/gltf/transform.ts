export function swapFromYupToZup(position: Float32Array) {
    for (let i = 0; i < position.length; i += 3) {
        const y = position[i + 1];
        position[i + 1] = -position[i + 2];
        position[i + 2] = y;
    }
}
