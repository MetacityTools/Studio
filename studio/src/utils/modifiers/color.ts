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

export function getColorMap(map: string) {
    switch (map) {
        case 'plasma':
            return [
                '#0d0887',
                '#350498',
                '#5302a3',
                '#6f00a8',
                '#8b0aa5',
                '#a31e9a',
                '#b83289',
                '#cc4778',
                '#db5c68',
                '#e97158',
                '#f48849',
                '#fba238',
                '#febd2a',
                '#fada24',
                '#f0f921',
            ];
        case 'viridis':
            return [
                '#440154',
                '#481b6d',
                '#46327e',
                '#3f4788',
                '#365c8d',
                '#2e6e8e',
                '#277f8e',
                '#21918c',
                '#1fa187',
                '#2db27d',
                '#4ac16d',
                '#73d056',
                '#a0da39',
                '#d0e11c',
                '#fde725',
            ];
        case 'inferno':
            return [
                '#000004',
                '#0d0829',
                '#280b53',
                '#470b6a',
                '#65156e',
                '#82206c',
                '#9f2a63',
                '#bc3754',
                '#d44842',
                '#e8602d',
                '#f57d15',
                '#fc9f07',
                '#fac228',
                '#f3e55d',
                '#fcffa4',
            ];
        case 'magma':
            return [
                '#000004',
                '#0c0926',
                '#221150',
                '#400f74',
                '#5f187f',
                '#7b2382',
                '#982d80',
                '#b73779',
                '#d3436e',
                '#eb5760',
                '#f8765c',
                '#fd9a6a',
                '#febb81',
                '#fddc9e',
                '#fcfdbf',
            ];
    }
}

export function colorMapToValues(map: string | string[]): vec3[] {
    if (typeof map === 'string') {
        return getColorMap(map)?.map((color) => colorStrToArr(color)) ?? [];
    } else {
        return map.map((color) => colorStrToArr(color));
    }
}
