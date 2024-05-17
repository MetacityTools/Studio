import * as GL from '@bananagl/bananagl';

import { shader } from './GridModelShader';

export class GridModel extends GL.Model {
    constructor(span: number = 100000, step: number = 1000) {
        super();

        const vertices = gridXY([-span, -span], [span, span], -1, step, 10);
        this.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
        this.shader = shader;

        this.data = {
            name: 'Grid',
            type: 'editor_internal_grid',
        };

        this.uniforms = {
            uUnit: step,
        };

        this.visible = false;
    }
}

const MAJOR_WIDTH = 2;
const MINOR_WIDTH = 1;

function gridXY(from: number[], to: number[], z: number, major: number, divideMajor: number) {
    const positions: number[] = [];
    const minor = major / divideMajor;

    const xFrom = Math.floor(from[0] / major) * major;
    const yFrom = Math.floor(from[1] / major) * major;
    const xTo = Math.ceil(to[0] / major) * major;
    const yTo = Math.ceil(to[1] / major) * major;

    for (let x = xFrom; x <= xTo; x += minor) {
        if (x % major === 0) {
            //xMajor.push(x, yFrom, z, x, yTo, z);
            pushYLine(positions, x, yFrom, z, yTo, MAJOR_WIDTH);
        } else {
            pushYLine(positions, x, yFrom, z, yTo, MINOR_WIDTH);
        }
    }

    for (let y = yFrom; y <= yTo; y += minor) {
        if (y % major === 0) {
            //yMajor.push(xFrom, y, z, xTo, y, z);
            pushXLine(positions, xFrom, y, z, xTo, MAJOR_WIDTH);
        } else {
            pushXLine(positions, xFrom, y, z, xTo, MINOR_WIDTH);
        }
    }

    return new Float32Array(positions);
}

function pushYLine(
    positions: any[],
    x: number,
    yFrom: number,
    z: number,
    yTo: number,
    width: number
) {
    positions.push(x - width * 0.5, yFrom, z);
    positions.push(x + width * 0.5, yFrom, z);
    positions.push(x + width * 0.5, yTo, z);
    positions.push(x - width * 0.5, yFrom, z);
    positions.push(x + width * 0.5, yTo, z);
    positions.push(x - width * 0.5, yTo, z);
}

function pushXLine(
    positions: any[],
    xFrom: number,
    y: number,
    z: number,
    xTo: number,
    width: number
) {
    positions.push(xFrom, y - width * 0.5, z);
    positions.push(xTo, y - width * 0.5, z);
    positions.push(xTo, y + width * 0.5, z);
    positions.push(xFrom, y - width * 0.5, z);
    positions.push(xTo, y + width * 0.5, z);
    positions.push(xFrom, y + width * 0.5, z);
}
