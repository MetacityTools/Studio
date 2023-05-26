import { gridXY } from '@utils/geometry/grid';

import * as GL from '@bananagl/bananagl';

const vertexShader = `
in vec3 position;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
out vec4 fragColor;

void main() {
    fragColor = vec4(0.9, 0.9, 0.9, 0.8);
}
`;

const shader = new GL.Shader(vertexShader, fragmentShader, false, false);

export function GridModel(span: number = 100000, step: number = 1000) {
    const vertices = gridXY([-span, -span], [span, span], -1, step, 10);

    const glmodel = new GL.Model();
    glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
    glmodel.shader = shader;

    glmodel.data = {
        name: 'Grid',
        type: 'editor_internal_grid',
    };

    glmodel.uniforms = {
        uUnit: step,
    };

    return glmodel;
}
