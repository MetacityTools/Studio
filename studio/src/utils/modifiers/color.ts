import { vec3 } from 'gl-matrix';

function lerpColor(a: vec3, b: vec3, fade: number): vec3 {
    return [a[0] + (b[0] - a[0]) * fade, a[1] + (b[1] - a[1]) * fade, a[2] + (b[2] - a[2]) * fade];
}

export function linearInterpolateColor(colorHexMap: vec3[], indicator: number) {
    if (colorHexMap.length == 1) {
        return colorHexMap[0];
    }
    const index0 = Math.floor(indicator * (colorHexMap.length - 1));
    const index1 = Math.min(index0 + 1, colorHexMap.length - 1);
    const F = 1 / (colorHexMap.length - 1);
    const fade = (indicator - index0 * F) / F;
    return lerpColor(colorHexMap[index0], colorHexMap[index1], fade);
}

export function sampleColor(color: vec3 | vec3[], indicator: number) {
    if (Array.isArray(color[0])) {
        return linearInterpolateColor(color as vec3[], Math.min(Math.max(indicator, 0), 1));
    }
    return color as vec3;
}

export function colorHexToArr255(hex: number): [number, number, number] {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return [r, g, b];
}

export function colorHexToArr(hex: number): [number, number, number] {
    const r = ((hex >> 16) & 255) / 255;
    const g = ((hex >> 8) & 255) / 255;
    const b = (hex & 255) / 255;
    return [r, g, b];
}

export function colorStrToHex(color: string) {
    return parseInt(color.replace('#', ''), 16);
}

export function colorStrToArr(str: string): vec3 {
    const hex = colorStrToHex(str);
    return colorHexToArr(hex);
}

export function colorHexToStr(hex: number): string {
    return '#' + hex.toString(16).padEnd(6, '0');
}

export function parseColor(color: number | string | vec3 | undefined): vec3 | undefined {
    if (color === undefined) {
        return undefined;
    } else if (typeof color === 'number') {
        return colorHexToArr(color);
    } else if (typeof color === 'string') {
        return colorStrToArr(color);
    } else if (Array.isArray(color)) {
        if (color.length == 3 && color.every((c) => typeof c === 'number')) return color as vec3;
    }

    throw new Error(`Invalid color: ${color}`);
}

export function randomColor() {
    return colorHexToStr(Math.floor(Math.random() * 16777215));
}
