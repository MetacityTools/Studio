import { Vec3 } from 'types';

import { Camera } from '@3D/scene/camera';
import { Scene } from '@3D/scene/scene';

import { viewRenderPass } from './pass';
import { Renderer } from './renderer';

export class View {
    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private randomColor: Vec3;
    readonly camera: Camera = new Camera();

    constructor(readonly scene: Scene) {
        this.randomColor = [Math.random(), Math.random(), Math.random()];
    }

    resize(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(renderer: Renderer) {
        const gl = renderer.gl;
        gl.clearColor(this.randomColor[0], this.randomColor[1], this.randomColor[2], 1);
        gl.viewport(this.x, this.y, this.width, this.height);
        gl.scissor(this.x, this.y, this.width, this.height);
        viewRenderPass(this.scene, renderer, this.camera);
    }

    renderLayout(renderer: Renderer) {
        const gl = renderer.gl;
        gl.clearColor(this.randomColor[0], this.randomColor[1], this.randomColor[2], 1);
        gl.viewport(this.x, this.y, this.width, this.height);
        gl.scissor(this.x, this.y, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
}
