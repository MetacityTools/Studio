import { mat4 } from 'gl-matrix';
import { UserInputModel } from 'types';

import { loadModels } from '@utils/formats/loader';
import { alignToOrigin } from '@utils/geometry/grid';

import * as GL from '@bananagl/bananagl';

import { computeNormals } from '../geometry/normals';
import { EditorModel } from './EditorModel';
import { modelToGltf } from './export';

const vertexShader = `
in vec3 position;
in vec3 normal;
in vec3 color;
in vec4 submodel;

const vec3 lightDirection = normalize(vec3(0.25, 0.25, 1.0));
out vec3 oColor; 

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uCameraPosition;
uniform vec3 uCameraTarget;

uniform float uZMin;
uniform float uZMax;


void main() {
    vec3 invNormal = -normal;
    vec3 direction = normalize(uCameraPosition - uCameraTarget);
    float factorA = dot(normal, lightDirection);
    float factorB = dot(invNormal, lightDirection);

    float factor = max(factorA, factorB);
    oColor = vec3(factor) * 0.2 + vec3(0.7);
    oColor *= mix(vec3(0.5), vec3(1.0), smoothstep(uZMin, uZMax, position.z));
    oColor *= color;
    //oColor *= submodel.xyz;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
in vec3 oColor;

out vec4 fragColor;

void main() {
    vec3 color = oColor;
    fragColor = vec4(color, 1.0);
}
`;

const shader = new GL.Shader(vertexShader, fragmentShader);

export async function UserModels(scene: GL.Scene, models: UserInputModel[]) {
    const modelData = await loadModels(models);

    modelData.forEach((model) => {
        const glmodel = new EditorModel();
        const vertices = model.geometry.position;
        const submodel = model.geometry.submodel;

        const byteSubmodel = new Uint8Array(submodel.buffer);
        alignToOrigin([vertices]);

        const colors = new Uint8Array(vertices.length).fill(255);

        const normals = computeNormals(vertices);
        glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
        glmodel.attributes.add(new GL.Attribute('normal', new GL.Buffer(normals), 3));
        glmodel.attributes.add(new GL.Attribute('color', new GL.Buffer(colors), 3, true));
        glmodel.attributes.add(new GL.Attribute('submodel', new GL.Buffer(byteSubmodel), 4));
        glmodel.shader = shader;
        glmodel.data = model.metadata.data;
        glmodel.name = model.metadata.name;

        glmodel.uniforms = {
            uModelMatrix: mat4.identity(mat4.create()),
            uZMin: 15,
            uZMax: 40,
        };

        glmodel.onPick = (object, idx, ray, t) => {
            console.log('Picked', object, idx, ray, t);
            const color = object.attributes.getAttribute('color');
            const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
            const submodelBuffer = submodel.buffer.getView(Uint32Array);

            if (!color) return;
            if (!submodel) return;

            const sidx = idx * 3;
            const id = submodelBuffer[sidx];
            let updateStart, updateEnd;

            for (let i = 0; i < submodelBuffer.length; i++) {
                if (submodelBuffer[i] === id) {
                    const scidx = i * 3;
                    color.buffer.data[scidx] = 255;
                    color.buffer.data[scidx + 1] = 180;
                    color.buffer.data[scidx + 2] = 50;

                    if (updateStart === undefined) {
                        updateStart = scidx;
                        updateEnd = scidx + 3;
                    } else if (updateEnd === scidx) {
                        updateEnd = scidx + 3;
                    } else {
                        color.buffer.toUpdate(updateStart, updateEnd);
                        updateStart = scidx;
                        updateEnd = scidx + 3;
                    }
                }
            }

            color.buffer.toUpdate(updateStart, updateEnd);
        };

        //modelToGltf(glmodel);

        console.log('Adding model', glmodel);
        scene.add(glmodel, true);
    });
}
