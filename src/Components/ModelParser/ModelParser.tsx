import React from 'react';
import { IFCLoaderData } from 'types';

import * as GL from '@3D/3D';

import { Container } from '@components/Elements/Container';

import { ModelInput } from './Input';

const vertexShader = `
in vec3 position;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

const shader = new GL.Shader(vertexShader, fragmentShader);

export function ModelParser() {
    const [renderer, setRenderer] = React.useState(new GL.Renderer());
    const [scene, setScene] = React.useState(new GL.Scene());

    const handleModelParsed = (model: IFCLoaderData) => {
        console.log(model);
        for (let mesh of model.data) {
            const glmodel = new GL.Model();
            const vertices = mesh.geometry.position;
            const indices = mesh.geometry.index;

            let min = Infinity;
            let max = -Infinity;

            for (let i = 0; i < vertices.length; i += 3) {
                min = Math.min(min, vertices[i + 2]);
                max = Math.max(max, vertices[i + 2]);
            }

            console.log(min, max);

            glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
            glmodel.attributes.add(
                new GL.ElementAttribute('index', new GL.ElementBuffer(indices), 3)
            );
            glmodel.shader = shader;
            scene.add(glmodel);
            console.log(glmodel);
        }
    };

    return (
        <Container full>
            <div className="flex flex-row h-screen">
                <div>
                    <ModelInput onModelParsed={handleModelParsed} />
                </div>
                <GL.Canvas renderer={renderer} className="w-[80%]">
                    <GL.View scene={scene} left={0} top={0} width={100} height={100} />
                </GL.Canvas>
                <GL.Profiler scenes={[scene]} />
            </div>
        </Container>
    );
}
