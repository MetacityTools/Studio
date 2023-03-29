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
        for (const mesh of Object.keys(model.data)) {
            const glmodel = new GL.Model();
            const vertices = new Float32Array(model.data[mesh]);
            glmodel.shader = shader;
            glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
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
                    <GL.View scene={scene} left={0} top={0} width={50} height={100} />
                    <GL.View scene={scene} left={50} top={0} width={50} height={100} />
                </GL.Canvas>
                <GL.Profiler scenes={[scene]} />
            </div>
        </Container>
    );
}
