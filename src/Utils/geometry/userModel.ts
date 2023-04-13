import { mat4 } from 'gl-matrix';
import { UserInputModel } from 'types';

import { loadModels } from '@utils/formats/loader';
import { alignToOrigin } from '@utils/gridify/grid';

import * as GL from '@bananagl/bananagl';

import { computeDots } from './normals';

const vertexShader = `
in vec3 position;
in float dots;

const vec3 light = normalize(vec3(0.0, 0.0, 1.0));

out vec3 color;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main() {
    color = dots * vec3(1.0, 1.0, 1.0) * 0.8 + vec3(0.2);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
in vec3 color;

out vec4 fragColor;

void main() {
    fragColor = vec4(color, 0.1);
}
`;

const shader = new GL.Shader(vertexShader, fragmentShader);

export async function addUserModels(scene: GL.Scene, models: UserInputModel[]) {
    const modelData = await loadModels(models);
    console.log(modelData);

    modelData.forEach((model) => {
        const glmodel = new GL.Model();
        const vertices = model.geometry.position;
        alignToOrigin([vertices]);
        const dots = computeDots(vertices);
        glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
        glmodel.attributes.add(new GL.Attribute('dots', new GL.Buffer(dots), 1));
        glmodel.shader = shader;

        glmodel.data = {
            name: model.name,
            imported: true,
        };

        glmodel.uniforms = {
            uModelMatrix: mat4.identity(mat4.create()),
        };

        scene.add(glmodel);
    });
}
