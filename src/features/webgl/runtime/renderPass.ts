import { Camera } from './camera';
import { Renderable } from './renderable';
import { Shader } from './shader';

export type SortedRenderables = {
    opaqueObjects: Renderable[];
    transparentObjects: Renderable[];
    noDepthObjects: Renderable[];
};

export const renderPass = (
    gl: WebGL2RenderingContext,
    scene: SortedRenderables,
    camera: Camera
) => {
    //TODO it might be possible that the gl context changes between render passes
    //     so we should probably check how we setup programs/buffers etc.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    const noDepth = scene.noDepthObjects;
    renderObjectGroup(gl, noDepth, camera);

    gl.enable(gl.DEPTH_TEST);
    const opaque = scene.opaqueObjects;
    renderObjectGroup(gl, opaque, camera);

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    const transparent = scene.transparentObjects;
    renderObjectGroup(gl, transparent, camera);
};

const renderObjectGroup = (gl: WebGL2RenderingContext, objects: Renderable[], camera: Camera) => {
    let shader: Shader | null = null;
    for (const renderable of objects) {
        if (!renderable.visible) continue;
        if (shader === null || renderable.shader !== shader) {
            shader = renderable.shader;

            if (!shader.active) shader.setup(gl);
            shader.use(gl);
        }
        render(gl, renderable, shader, camera);
    }
};

const render = (
    gl: WebGL2RenderingContext,
    renderable: Renderable,
    shader: Shader,
    camera: Camera
) => {
    shader.setUniforms(gl, camera.uniforms);
    shader.setUniforms(gl, renderable.uniforms);

    renderable.geometry.update(gl);
    renderable.geometry.bind(gl, shader);

    if (renderable.geometry.isIndexed) {
        if (renderable.geometry.isInstanced) {
            console.warn('Instanced indexed rendering not supported');
        } else {
            gl.drawElements(
                renderable.mode,
                renderable.geometry.count,
                renderable.geometry.elementType,
                0
            );
        }
    } else {
        if (renderable.geometry.isInstanced) {
            gl.drawArraysInstanced(
                renderable.mode,
                0,
                renderable.geometry.count,
                renderable.geometry.instanceCount
            );
        } else {
            gl.drawArrays(renderable.mode, 0, renderable.geometry.count);
        }
    }
};
