import { mat4 } from 'gl-matrix';
import { UserInputModel } from 'types';

import { loadModels } from '@utils/formats/loader';
import { alignToOrigin } from '@utils/gridify/grid';

import * as GL from '@bananagl/bananagl';

import { computeNormals } from './normals';

const vertexShader = `
in vec3 position;
in vec3 normal;

const vec3 lightDirection = normalize(vec3(0.25, 0.25, 1.0));
out vec3 color;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

const float zMin = 200.0;
const float zMax = 350.0;

void main() {
    vec3 invNormal = -normal;
    vec3 direction = normalize(uCameraPosition - uCameraTarget);
    float factorA = dot(normal, lightDirection);
    float factorB = dot(invNormal, lightDirection);

    float factor = max(factorA, factorB);
    color = vec3(factor) * 0.2 + vec3(0.7);
    color = mix(vec3(0.5), color, smoothstep(zMin, zMax, position.z));

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
in vec3 color;

out vec4 fragColor;

void main() {
    fragColor = vec4(color, 1.0);
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
        const normals = computeNormals(vertices);
        glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
        glmodel.attributes.add(new GL.Attribute('normal', new GL.Buffer(normals), 3));
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
