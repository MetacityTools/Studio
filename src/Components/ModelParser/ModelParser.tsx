import React from 'react';
import { IFCLoaderData } from 'types';

import * as GL from '@3D/3D';

import { Container } from '@components/Elements/Container';

import { ModelInput } from './Input';

const vertexShader = `
in vec3 position;
in vec3 normal;

const vec3 light = normalize(vec3(0.0, 0.0, 1.0));

out vec3 color;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main() {
    color = dot(normal, light) * vec3(1.0, 1.0, 1.0) * 0.5 + vec3(0.5, 0.5, 0.5);
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(position, 1.0);
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

export function ModelParser() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());

    const handleModelParsed = (model: IFCLoaderData) => {
        for (let mesh of model.data) {
            console.log(mesh);
            const glmodel = new GL.Model();
            const vertices = mesh.geometry.position;
            const indices = mesh.geometry.index;
            const normals = mesh.geometry.normal;

            glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
            glmodel.attributes.add(new GL.Attribute('normal', new GL.Buffer(normals), 3));
            glmodel.attributes.add(
                new GL.ElementAttribute('index', new GL.ElementBuffer(indices), 3)
            );
            glmodel.shader = shader;
            scene.add(glmodel);
        }
    };

    return (
        <Container full>
            <div className="flex flex-row h-screen">
                <div>
                    <ModelInput onModelParsed={handleModelParsed} />
                </div>
                <GL.Canvas renderer={renderer} className="w-[80%]">
                    <GL.View scene={scene} left={0} top={0} width={100} height={50} />
                    <GL.View scene={scene} left={0} top={50} width={100} height={50} />
                </GL.Canvas>
            </div>
        </Container>
    );
}

//<GL.Profiler scenes={[scene]} />
